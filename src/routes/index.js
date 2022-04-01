import express from "express";
import { register_controller, login_controller, otp_controller, refresh_controller } from "../controller";
import {auth, admin} from '../middleware'

const router = express.Router()

//Authentication
router.post('/register', register_controller.register)
router.post('/login', login_controller.login)
router.post('/refresh', refresh_controller.refresh)
router.post('/logout', login_controller.logout)
router.post('/sendotp', auth, otp_controller.otp_register)
router.post('/confirmotp', auth, otp_controller.otp_confirm)

//Admin


//App


export default router