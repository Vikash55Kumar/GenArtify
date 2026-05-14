import express from 'express'
import {userRegister, userLogin, userLogout, userCredit, userPayment, verifyPayment,} from "../controller/user.controller.js"
import userAuth from '../middleware/user.auth.js'

const userRouter = express.Router()

userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.post('/logout', userAuth, userLogout)
userRouter.get('/credits', userAuth, userCredit)
userRouter.post('/razor-payment', userAuth, userPayment)
userRouter.post('/verify-payment', verifyPayment)
userRouter.route("/active").get((req, res) => {res.send("active")});

export default userRouter;