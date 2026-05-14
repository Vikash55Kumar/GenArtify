import axios from "axios";
import User from "../models/user.model.js";
import FormData from "form-data";

const generateImage = async(req, res) => {
    try {
        const {prompt} = req.body;
        
        if(!prompt) {
            return res.status(400).json({success:false, message: "Prompt is required"});
        }

        const user = await User.findById(req.user.id).select('creditBalance').lean().exec();
        
        if(!user) {
            return res.status(404).json({success:false, message: "User not found"});
        }

        if(user.creditBalance === 0) {
            return res.status(400).json({success:false, message: "No credit balance", creditBalance: user.creditBalance});
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
        
        res.json({success:true, message: "Image Generated Successfully", creditBalance: user.creditBalance, resultImage})

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message})
    }
}

export {generateImage}
