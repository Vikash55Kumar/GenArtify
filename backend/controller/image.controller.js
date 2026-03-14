import axios from "axios";
import User from "../models/user.model.js";
import Workspace from "../models/workspace.model.js";
import FormData from "form-data";
import {
    trackImageGenerate,
    trackCreditsConsume,
    trackCreditsExhausted,
    identifyDestylUser
} from "../utils/destyl.js";

const getDestylContext = async (workspaceId) => {
    if (!workspaceId) {
        return {
            accountId: null,
            ingestKey: process.env.DESTYL_INGEST_KEY || "",
            projectId: process.env.DESTYL_PROJECT_ID || null
        };
    }

    const workspace = await Workspace.findById(workspaceId).lean();
    return {
        accountId: String(workspace?._id || workspaceId),
        ingestKey: workspace?.destylIngestKey || process.env.DESTYL_INGEST_KEY || "",
        projectId: workspace?.destylProjectId || process.env.DESTYL_PROJECT_ID || null
    };
};

const generateImage = async(req, res) => {
    try {
        const {prompt} = req.body

        console.log(prompt);
        
        if(!prompt) {
            return res.json({success:false, message: "Prompt are required"})
        }
        const user = await User.findById(req.user.id);

        if(!user) {
            return res.json({success:false, message: "User not exist"})
        }

        console.log(user.creditBalance);
        

        const destyl = await getDestylContext(user.workspaceId || null);
        const accountId = destyl.accountId || String(user._id);

        if(user.creditBalance === 0) {
            void trackCreditsExhausted({
                userId: String(user._id),
                accountId,
                ingestKey: destyl.ingestKey,
                properties: {
                    reason: "No credits available",
                    projectId: destyl.projectId
                }
            })
            return res.json({success:false, message: "No Credit balance", creditBalance: user.creditBalance})
        }

        const form = new FormData()
        form.append('prompt', prompt)

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', form, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')

        const resultImage = `data:image/png;base64,${base64Image}`

        await User.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance -1})

        // user.creditBalance -= 1;
        user.generatedImage.unshift({ image: resultImage, date: new Date() });

        const userUpdate = await user.save()

        void trackImageGenerate({
            userId: String(user._id),
            accountId,
            ingestKey: destyl.ingestKey,
            properties: {
                prompt_length: prompt.length,
                credits_used: 1,
                projectId: destyl.projectId
            }
        })

        void trackCreditsConsume({
            userId: String(user._id),
            accountId,
            ingestKey: destyl.ingestKey,
            properties: {
                credits_used: 1,
                remaining_credits: userUpdate.creditBalance,
                projectId: destyl.projectId
            }
        })

        void identifyDestylUser({
            userId: String(user._id),
            accountId,
            ingestKey: destyl.ingestKey,
            traits: {
                email: user.email,
                name: user.name,
                credits: userUpdate.creditBalance,
                workspaceId: accountId,
                source: "genartify"
            }
        });

        if(userUpdate.creditBalance === 0) {
            void trackCreditsExhausted({
                userId: String(user._id),
                accountId,
                ingestKey: destyl.ingestKey,
                properties: {
                    reason: "Credits depleted after generation",
                    projectId: destyl.projectId
                }
            })
        }

        res.json({success:true, message: "Image Generated Successfully", creditBalance: userUpdate.creditBalance, resultImage})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export {generateImage}
