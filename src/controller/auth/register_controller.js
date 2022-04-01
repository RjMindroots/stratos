import Joi from 'joi'
import bcrypt from 'bcrypt'
import { User, RefreshToken } from "../../model"
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtServices from '../../services/JwtServices'
import { REFRESH_SECRET } from '../../config'

const register_controller = {
    async register(req, res, next) {
        const { email, password, c_password, first_name, last_name, dob, city, social_token, login_type, user_details } = req.body

        if (login_type === "4") {
            //requested data valid or not
            const registerSchema = Joi.object({
                email: Joi.string().email({ tlds: { allow: false } }),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
                c_password: Joi.ref('password'),
                first_name: Joi.string().required()
            })
            const { error } = registerSchema.validate({ email, password, c_password, first_name })
            if (error) {
                return next(error)
            }

        }

        try {
            if (login_type === "4") {
                const exist = await User.exists({ email: req.body.email })
                if (exist) {
                    return next(CustomErrorHandler.alreadyExist('User is already exist'));
                }
            } else if (login_type === "1" || login_type === "2" || login_type === "3") {
                let userExist;
                if (user_details.email) {
                    userExist = await User.findOne({ email: user_details.email })
                    console.log(userExist)
                }
                if (userExist) {
                    return next(CustomErrorHandler.alreadyExist('User is already exist'));
                }
            } else {
                return next(CustomErrorHandler.serverError('Please Provide a valid signup platform type'));
            }
        } catch (err) {
            return next(err)
        }

        //hashpassword
        const hashedpassword = await bcrypt.hash(password, 16)
        if (login_type === "4") {
            const user = new User({
                email,
                password: hashedpassword,
                first_name,
                last_name,
                dob,
                city,
                social_token,
                login_type
            })
        }else if (login_type === "1" || login_type === "2" || login_type === "3") { 
            const user = new User({
                email: user_details.email ? user_details.email : "",
                password,
                first_name: user_details.first_name ? user_details.first_name : "",
                last_name : user_details.last_name ? user_details.last_name : "" ,
                dob: user_details.dob ? user_details.date_of_birth : "" ,
                city,
                social_token,
                login_type
            })

        }

        let access_token;
        let refresh_token;
        let data;

        try {

            data = await user.save()
            // Token
            access_token = JwtServices.sign({ _id: data._id, role: data.role });
            refresh_token = JwtServices.sign({ _id: data._id, role: data.role }, '1y', REFRESH_SECRET)
            await RefreshToken.create({ token: refresh_token })

        } catch (err) {
            return next(err)
        }
        res.json({ access_token, refresh_token, status: 200, data });
    }

}

export default register_controller