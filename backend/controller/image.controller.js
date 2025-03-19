import axios from "axios";
import User from "../models/user.model.js";
import FormData from "form-data";

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
        

        if(user.creditBalance === 0) {
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

        res.json({success:true, message: "Image Generated Successfully", creditBalance: userUpdate.creditBalance, resultImage})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export {generateImage}