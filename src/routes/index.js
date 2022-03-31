import express from "express";
import { register_controller, login_controller, otp_controller } from "../controller";
import {auth, admin} from '../middleware'

const router = express.Router()

//Authentication
router.post('/register', register_controller.register)
router.post('/login', login_controller.login)
router.post('/logout', login_controller.logout)
router.post('/sendotp', auth, otp_controller.otp_register)

//Admin


//App


export default router