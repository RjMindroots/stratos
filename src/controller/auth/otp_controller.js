import Joi from 'joi'
import { Otp, User } from "../../model"
import otpGenerator from 'otp-generator'
import CustomErrorHandler from '../../services/CustomErrorHandler'
const nodemailer = require("nodemailer");

const otp_verification = {
    async otp_register(req, res, next) {

        let updateOtp
        let info
        const { token, email } = req.body

        const registerSchema = Joi.object({
            token: Joi.string().required(),
        })

        const { error } = registerSchema.validate({ token })

        if (error) {
            return next(error)
        }

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'wpmindroots@gmail.com', // generated ethereal user
                pass: 'ropkrilobfptmykv', // generated ethereal password
            },
        });

        try {
            const otpExist = await Otp.exists({ token })
            if (otpExist) {
                const newotp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

                info = await transporter.sendMail({
                    from: 'wpmindroots@gmail.com',
                    to: email,
                    subject: "Email verification",
                    html: `Your otp is ${newotp}`,
                });

                updateOtp = await Otp.findOneAndUpdate({token: req.body.token}, {$set:{otp: newotp}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log(err)
                    }
                });
                console.log(updateOtp)
            } else {
                const userExist = await User.exists({ _id : req.user._id })
                if (userExist) {
                    const otp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

                    info = await transporter.sendMail({
                        from: 'wpmindroots@gmail.com',
                        to: email,
                        subject: "Email verification",
                        html: `Your otp is ${otp}`,
                    });
                    const result = await Otp({ otp, token }).save()
                    updateOtp = result.otp
                } else {
                    return next(CustomErrorHandler.unAuthorized("Invalid User"))
                }

            }

            res.json({ message: updateOtp })

        } catch (err) {
            next(err)
        }

        
    },
    

    async otp_confirm(req, res, next) {
        const { token, otp } = req.body


        
    }
}
export default otp_verification