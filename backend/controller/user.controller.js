import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Razorpay from "razorpay";
import Transaction from "../models/transaction.model.js";
import Workspace from "../models/workspace.model.js";
import {
    trackUserSignup,
    trackUserLogin,
    trackPaymentSuccess,
    trackPaymentFailed,
    identifyDestylUser,
    identifyDestylGroup
} from "../utils/destyl.js";

const slugify = (value) =>
    String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const ensureWorkspace = async (user) => {
    if (user.workspaceId) return user.workspaceId;
    const baseSlug = slugify(user.email || user.name || String(user._id));
    let slug = baseSlug || `workspace-${String(user._id).slice(-6)}`;
    let suffix = 1;
    while (await Workspace.findOne({ slug })) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }
    const workspace = await Workspace.create({
        name: `${user.name || "User"} Workspace`,
        slug,
        ownerId: user._id,
        members: [user._id],
        destylProjectId: process.env.DESTYL_PROJECT_ID || null,
        destylIngestKey: process.env.DESTYL_INGEST_KEY || null
    });
    await User.findByIdAndUpdate(user._id, { workspaceId: workspace._id });
    return workspace._id;
};

const getDestylContext = async (workspaceId) => {
    if (!workspaceId) {
        return {
            accountId: null,
            ingestKey: process.env.DESTYL_INGEST_KEY || "",
            projectId: process.env.DESTYL_PROJECT_ID || null,
            workspaceName: null,
            workspaceSlug: null
        };
    }

    const workspace = await Workspace.findById(workspaceId).lean();
    return {
        accountId: String(workspace?._id || workspaceId),
        ingestKey: workspace?.destylIngestKey || process.env.DESTYL_INGEST_KEY || "",
        projectId: workspace?.destylProjectId || process.env.DESTYL_PROJECT_ID || null,
        workspaceName: workspace?.name || null,
        workspaceSlug: workspace?.slug || null
    };
};

const userRegister = async(req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;
        console.log(name, email, password, confirmPassword);
        
        if(!name || !email || !password || !confirmPassword) {
            return res.json({success:false, message: "All fields are required"})
        }

        if(!(password === confirmPassword)) {
            return res.json({success:false, message: "Password not same"})
        }

        const existUser = await User.findOne({email});

        if(existUser) {
            return res.json({success:false, message: "User already exist with this email"})
        }
    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt) 
    
        const userData = new User({
            name,
            email,
            password: hashedPassword
        })
    
        const user = await userData.save()
        const workspaceId = await ensureWorkspace(user);
        const destyl = await getDestylContext(workspaceId);

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        void identifyDestylGroup({
            accountId: destyl.accountId,
            ingestKey: destyl.ingestKey,
            traits: {
                workspaceId: destyl.accountId,
                workspaceName: destyl.workspaceName,
                workspaceSlug: destyl.workspaceSlug,
                projectId: destyl.projectId,
                source: "genartify"
            }
        });

        void identifyDestylUser({
            userId: String(user._id),
            accountId: destyl.accountId,
            ingestKey: destyl.ingestKey,
            traits: {
                email: user.email,
                name: user.name,
                credits: user.creditBalance,
                workspaceId: destyl.accountId,
                source: "genartify"
            }
        });

        void trackUserSignup({
            userId: String(user._id),
            accountId: destyl.accountId,
            ingestKey: destyl.ingestKey,
            properties: {
                email: user.email,
                name: user.name,
                credits: user.creditBalance,
                workspaceId: destyl.accountId,
                projectId: destyl.projectId
            }
        })

        res.json({success: true, token, user: user, message:"User register successfully"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const userLogin = async(req, res) => {
    try {
        const {email, password} = req.body
        console.log(email, password);
        
        if(!email || !password) {
            return res.json({success:false, message: "All fields are required"})
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.json({success: false, message: 'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.json({success:false, message: "Invalid credentials"})
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        const workspaceId = await ensureWorkspace(user);
        const destyl = await getDestylContext(workspaceId);

        void identifyDestylUser({
            userId: String(user._id),
            accountId: destyl.accountId,
            ingestKey: destyl.ingestKey,
            traits: {
                email: user.email,
                name: user.name,
                credits: user.creditBalance,
                workspaceId: destyl.accountId,
                source: "genartify"
            }
        });

        void trackUserLogin({
            userId: String(user._id),
            accountId: destyl.accountId,
            ingestKey: destyl.ingestKey,
            properties: {
                email: user.email,
                name: user.name,
                credits: user.creditBalance,
                workspaceId: destyl.accountId,
                projectId: destyl.projectId
            }
        })

        res.json({success: true, token, user: user, message:"User login successfully"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const userCredit = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({success:true, credits: user.creditBalance, name:user.name})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const razorpayInstance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const razorpayPayment = async(req, res) => {
   try {
        const {planId} = req.body
        console.log("PlanId", planId);
        

        if(!planId) {
            return res.json({success:false, message: "Missing details"})
        }

        const user = await User.findById(req.user.id);

        if(!user) {
            return res.json({success:false, message: "user not found required"})
        }

        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
                plan = 'Basic',
                credits = 50
                amount = 10
                break;

            case 'Pro':
                plan = 'Pro',
                credits = 200
                amount = 30
                break;
            case 'Enterprise':
                plan = 'Enterprise',
                credits = 2000
                amount = 100
                break;

            default:
                return res.json({success: false, message: 'Plan not found'});
        }

        date = Date.now();

        const transactionData = {
            userId:user._id, plan, amount, credits, date
        }

        const newTransaction = await Transaction.create(transactionData)
        
        if(!newTransaction) {
            return res.json({success:false, message: "Server error while creating transaction"})
        }

        const options = {
            amount: amount*100,
            currency: process.env.CURRENCY || 'INR',
            receipt: String(newTransaction._id),
        }; 

        const order = await razorpayInstance.orders.create(options);
            
        if (!order) {
            return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
        }

        res.json({ success: true, message: "Payment Initialized", order });

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const verifyPayment = async(req, res) => {
    try {

        const {razorpay_order_id} = req.body
        console.log("razorpay_order_id", razorpay_order_id);

        if(!(razorpay_order_id)) {
            return res.json({success:false, message: "Order required"})
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid') {
            const transactionData = await Transaction.findById(orderInfo.receipt);
            
            if(transactionData.payment) {
                const paymentUser = await User.findById(transactionData.userId);
                const workspaceId = paymentUser ? await ensureWorkspace(paymentUser) : null;
                const destyl = await getDestylContext(workspaceId);
                void trackPaymentFailed({
                    userId: String(transactionData.userId),
                    accountId: destyl.accountId || String(transactionData.userId),
                    ingestKey: destyl.ingestKey,
                    properties: {
                        reason: "Payment already processed",
                        orderId: razorpay_order_id,
                        projectId: destyl.projectId
                    }
                })
                return res.json({success:false, message: "Payment Failed"})
            }

            const userData = await User.findById(transactionData.userId)
            const workspaceId = userData ? await ensureWorkspace(userData) : null;
            const destyl = await getDestylContext(workspaceId);

            const creditBalance = userData.creditBalance + transactionData.credits

            await User.findByIdAndUpdate(userData._id, {creditBalance})

            await Transaction.findByIdAndUpdate(transactionData._id, {payment:true})

            void trackPaymentSuccess({
                userId: String(userData._id),
                accountId: destyl.accountId || String(userData._id),
                ingestKey: destyl.ingestKey,
                properties: {
                    orderId: razorpay_order_id,
                    plan: transactionData.plan,
                    amount: transactionData.amount,
                    credits: transactionData.credits,
                    newCreditBalance: creditBalance,
                    projectId: destyl.projectId
                }
            })

            void identifyDestylUser({
                userId: String(userData._id),
                accountId: destyl.accountId,
                ingestKey: destyl.ingestKey,
                traits: {
                    email: userData.email,
                    name: userData.name,
                    credits: creditBalance,
                    workspaceId: destyl.accountId,
                    source: "genartify"
                }
            });

            res.json({success:true, message:"Credit Added"})
        } else {
            const failedUserId = String(orderInfo?.notes?.userId || "");
            const failedUser = failedUserId ? await User.findById(failedUserId) : null;
            const failedWorkspaceId = failedUser ? await ensureWorkspace(failedUser) : null;
            const destyl = await getDestylContext(failedWorkspaceId);
            void trackPaymentFailed({
                userId: failedUserId,
                accountId: destyl.accountId || String(failedUserId),
                ingestKey: destyl.ingestKey,
                properties: {
                    orderId: razorpay_order_id,
                    status: orderInfo.status,
                    projectId: destyl.projectId
                }
            })
            res.json({success:false, message: "Payment failed"})
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}



export {
    userRegister,
    userLogin,
    userCredit,
    razorpayPayment,
    verifyPayment
}
