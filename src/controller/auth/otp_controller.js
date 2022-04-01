import Joi from 'joi'
import otpService from '../../services/otpService'
import hashService from '../../services/hashService'

const otp_controller = {
    async send_otp(req, res, next) {
        const {email} = req.body

        const otpSchema = Joi.object({
            email: Joi.string().email({ tlds: { allow: false } })
        });
        const {error} = otpSchema.validate({email})
        if(error){
            return next(error)
        }

        if(!email) {
            return next({message:"Please provide email"})
        }
        // generateotp
        const otp = await otpService.generateotp()

        // hashService
        const ttl = 1000 * 60 * 2; //2 minutes
        const expires = Date.now() + ttl;
        const data = `${email}${otp}${expires}`;
        const hash = await hashService.hashOtp(data)

        //send to email 
        try {
            await otpService.sendotp(email, otp)
            return res.json({
                hash: `${hash}.${expires}`,
                email
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'otp send failed'})
        }





        res.json({hash : hash})

    },
    

    async otp_confirm(req, res, next) {
        const { email, otp, hash } = req.body

        if(!email || !otp || !hash ) {
            return next({message:"All fields are required"})
        }

        const [hashedOtp, expires] = hash.split(".")

        if(Date.now() > expires) {
            return next({message:"OTP expired!"})
        }

        const data = `${email}${otp}${expires}`;

        const isValid = otpService.verifyotp(hashedOtp, data)

        if(!isValid) {
            return next({message:"Invalid Otp"})
        } else {
            res.status(200).json({message:"Otp confirmed successfully"})
        }
    }
}

export default otp_controller