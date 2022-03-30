import express from "express";
import { register_controller, blog_controller, otp_verification } from "../controller";
import { User, Layer, Blog } from "../model";

const router = express.Router()
//Authentication
router.post('/register', register_controller.register)
router.post('/createblog', blog_controller.createblog)
router.post('/otp', otp_verification.otp_register)

//Admin


//App


export default router