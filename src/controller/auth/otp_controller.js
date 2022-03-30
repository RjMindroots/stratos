import Joi from 'joi'
import { Otp, User } from "../../model"
const otpGenerator = require('otp-generator')
import CustomErrorHandler from '../../services/CustomErrorHandler'
const nodemailer = require("nodemailer");

const otp_verification = {
    async otp_register(req, res, next) {

        let result;
        let updateOtp
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
                updateOtp = await Otp.findByIdAndUpdate({ _id: otpExist._id}, {$push: {otp: newotp}}, (err, doc) => {
                    if (err) res.json({message: "Have Some Error"})
                    else res.json(doc)
                })

            } else {
                const userExist = await User.exists({ email })
                if (userExist) {
                    const otp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
                    const result = await Otp({ otp, email }).save()
                } else {
                    return next(CustomErrorHandler.unAuthorized("Invalid User"))
                }

            }

        } catch (err) {
            next(err)
        }

        res.json({message: updateOtp})

        // const update = { 
        //     otp:otpcode,
        //     expiry_otp:expirydate
        // }
        // try {
        //     const exist = await Otp.exists({email: email})
        //     if (exist) {
        //        result = await Otp.updateOne({email},{
        //             $set : {
        //                 otp:otpcode,
        //                 expiry_otp:expirydate
        //             }
        //         }
        //         );
        //        res.json(result)
        //     }

        // } catch (err) {
        //     return next(err)
        // }

        // const otpsave = new Otp({ 
        //     email,
        //     otp:otpcode,
        //     expiry_otp:expirydate,
        // })
        // try{
        //     let testAccount = await nodemailer.createTestAccount();

        //     // create reusable transporter object using the default SMTP transport
        //     let transporter = nodemailer.createTransport({
        //         host: "smtp.ethereal.email",
        //         port: 587,
        //         secure: false, // true for 465, false for other ports
        //         auth: {
        //         user: testAccount.user, // generated ethereal user
        //         pass: testAccount.pass, // generated ethereal password
        //         },
        //     });

        //     // send mail with defined transport object
        //     let info = await transporter.sendMail({
        //         from: '"Fred Foo 👻" <bharatbharal20@gmail.com>', // sender address
        //         to: "bsaini.official@.com", // list of receivers
        //         subject: "Hello ✔", // Subject line
        //         text: "Otp :" +otpcode, // plain text body
        //         html: "<b>Otp: </b>"+otpcode, // html body
        //     });

        //     console.log("Message sent: %s", info);
        //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        //     // Preview only available when sending through an Ethereal account
        //     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        // }catch(err){
        //     return next(err)
        // }
        // try {
        //     result = await otpsave.save()

        // } catch (err) {
        //     return next(err)
        // }
        //     res.json({result});

    }
}
export default otp_verification