import Joi from 'joi'
import { Otp, User } from "../../model"
import otpGenerator from 'otp-generator'
import CustomErrorHandler from '../../services/CustomErrorHandler'
const nodemailer = require("nodemailer");

const otp_verification = {
    async otp_register(req, res, next) {

        // let testAccount = await nodemailer.createTestAccount();

        // let transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 587,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: 'wpmindroots@gmail.com', // generated ethereal user
        //         pass: 'ropkrilobfptmykv', // generated ethereal password
        //     },
        // });

        let result;
        let updateOtp
        let info
        const { email } = req.body

        const registerSchema = Joi.object({
            email: Joi.string().email().required(),
        })

        const { error } = registerSchema.validate({ email })

        if (error) {
            return next(error)
        }

        try {
            const otpExist = await Otp.exists({ email })
            if (otpExist) {
                const newotp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

                // info = await transporter.sendMail({
                //     from: '"wpmindroots@gmail.com', // sender address
                //     to: "wpmindroots@gmail.com", // list of receivers
                //     subject: "Email verification", // Subject line
                //     html: `Your otp is ${newotp}`, // html body
                // });

                updateOtp = await Otp.findOneAndUpdate({email: req.body.email}, {$set:{otp: newotp}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                    console.log(doc);
                });

            } else {
                const userExist = await User.exists({ email })
                if (userExist) {
                    const otp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
                    const result = await Otp({ otp, email }).save()
                    updateOtp = result.otp
                } else {
                    return next(CustomErrorHandler.unAuthorized("Invalid User"))
                }

            }

        } catch (err) {
            next(err)
        }

        res.json({ message: updateOtp })

    }
}
export default otp_verification