import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Razorpay from "razorpay";
import Transaction from "../models/transaction.model.js";

const userRegister = async(req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;
        if(!name || !email || !password || !confirmPassword) {
            return res.status(400).json({success:false, message: "All fields are required"})
        }

        if(password !== confirmPassword) {
            return res.status(400).json({success:false, message: "Passwords do not match"})
        }

        const existUser = await User.findOne({email}).lean().exec();

        if(existUser) {
            return res.status(400).json({success:false, message: "User already exists with this email"})
        }
    
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const userData = new User({
            name,
            email,
            password: hashedPassword
        });
        const user = await userData.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET || process.env.JWT_SECRET);

        res.json({success: true, token, user: user, message:"User registered successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
}

const userLogin = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}).select('+password').lean().exec();

        if(!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET || process.env.JWT_SECRET);
        res.json({success: true, token, user: user, message:"User login successful"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
}

const userCredit = async(req, res) => {
        try {
        const user = await User.findById(req.user.id).select('creditBalance name').lean().exec();
        res.json({success:true, credits: user.creditBalance, name:user.name});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
}

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});
const userPayment = async (req, res) => {
    try {
        const {planId} = req.body;
        if(!planId) {
            return res.status(400).json({success:false, message: "Missing plan details"});
        }

        const user = await User.findById(req.user.id).select('creditBalance').lean().exec();

        if(!user) {
            return res.status(404).json({success:false, message: "User not found"});
        }

        let credits, plan, amount;

        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 50;
                amount = 10;
                break;
            case 'Pro':
                plan = 'Pro';
                credits = 200;
                amount = 30;
                break;
            case 'Enterprise':
                plan = 'Enterprise';
                credits = 2000;
                amount = 100;
                break;
            default:
                return res.status(400).json({success: false, message: 'Invalid plan'});
        }

        const transactionData = {
            userId: user._id,
            plan,
            amount,
            credits,
            date: Date.now()
        };

        const newTransaction = await Transaction.create(transactionData);
        
        if(!newTransaction) {
            return res.status(500).json({success:false, message: "Server error while creating transaction"});
        }

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY || 'INR',
            receipt: String(newTransaction._id),
        }; 

        const order = await razorpayInstance.orders.create(options);
            
        if (!order) {
            return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
        }

        res.json({ success: true, message: "Payment Initialized", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
}

const verifyPayment = async (req, res) => {
    try {
        const {razorpay_order_id} = req.body;
        if(!razorpay_order_id) {
            return res.status(400).json({success:false, message: "Order ID required"});
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if(orderInfo.status === 'paid') {
            const transactionData = await Transaction.findById(orderInfo.receipt).lean().exec();
            const userData = await User.findById(transactionData.userId).lean().exec();

            const creditBalance = userData.creditBalance + transactionData.credits;
            await User.findByIdAndUpdate(userData._id, {creditBalance});
            await Transaction.findByIdAndUpdate(transactionData._id, {payment:true});

            res.json({success:true, message:"Credit Added"});
        } else {
            res.status(400).json({success:false, message: "Payment failed"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
}

const userLogout = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);

        return res.json({ success: true, message: "User logout tracked" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

export {
    userRegister,
    userLogin,
    userLogout,
    userCredit,
    userPayment,
    verifyPayment
}

