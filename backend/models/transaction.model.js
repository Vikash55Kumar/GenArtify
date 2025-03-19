import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type:String,
        reqired:true
    },
    amount: {
        type:Number,
        reqired:true
    },
    plan: {
        type:String,
        reqired:true
    },
    credits: {
        type:Number,
        reqired:true
    },
    payment: {
        type:Boolean,
        default:false
    },
    date: {
        type:Number,
    },
},{ timestamps: true })

const Transaction = mongoose.models.transaction || mongoose.model('Transaction', transactionSchema)

export default Transaction;