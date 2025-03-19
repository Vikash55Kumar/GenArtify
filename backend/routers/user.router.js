import express from 'express'
import {userRegister, userLogin, userCredit, razorpayPayment, verifyPayment,} from "../controller/user.controller.js"
import userAuth from '../middleware/user.auth.js'

const userRouter = express.Router()

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.get('/credits', userAuth, userCredit)
userRouter.post('/razor-payment', userAuth, razorpayPayment)
userRouter.post('/verify-payment', verifyPayment)

export default userRouter;