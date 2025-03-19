import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
    },

    email : {
        type:String,
        required: true,
        index: true,
        unique: true
    },

    password: {
        type:String,
        required: true,
    },

    creditBalance: {
        type:Number,
        default: 5
    },

    generatedImage: [{
        image:String,
        date: { 
            type: Date, 
            default: Date.now 
        }
    }],

}, { timestamps: true })

const User = mongoose.models.user || mongoose.model("User", userSchema)

export default User