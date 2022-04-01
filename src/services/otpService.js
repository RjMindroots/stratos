import crypto from 'crypto'
const nodemailer = require("nodemailer");
import hashService from './hashService';

class otpService {
    async generateotp() {
        const otp = crypto.randomInt(1000, 9999)
        return otp
    }

    async sendotp(email, otp) {

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'wpmindroots@gmail.com',
                pass: 'ropkrilobfptmykv'
            },
        });

        let info = await transporter.sendMail({
            from: 'wpmindroots@gmail.com',
            to: email,
            subject: "Email verification",
            html: `Your otp is ${otp}`,
        });

    }

    async verifyotp(hashedOtp, data) {
        let computedHash = await hashService.hashOtp(data)
        return computedHash == hashedOtp
    }
}

export default new otpService