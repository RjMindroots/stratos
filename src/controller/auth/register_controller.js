import Joi from 'joi'
import bcrypt from 'bcrypt'
import {User, RefreshToken} from "../../model"
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtServices from '../../services/JwtServices'
import { REFRESH_SECRET } from '../../config'

const register_controller = {
    async register (req, res, next) {

        //requested data valid or not
    const registerSchema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        c_password: Joi.ref('password'),
        first_name: Joi.string().required()
    })

    const {email, password, c_password, first_name, last_name, image, dob, city, job, layers, social_token, login_type} = req.body

    const {error} = registerSchema.validate({email, password, c_password, first_name} ) 
    if(error) {
        return next(error)
    }

    try {
        const exist = await User.exists({email: req.body.email})
        if (exist) {
            return next(CustomErrorHandler.alreadyExist('User is already exist'));
        }

    } catch (err) {
        return next(err)
    }

    //hashpassword
    const hashedpassword = await bcrypt.hash(password, 16)
    const user = new User({ 
        email,
        password : hashedpassword,
        first_name, 
        last_name, 
        image, 
        dob, 
        city, 
        job, 
        layers,
        social_token,
        login_type
    })

    let access_token;
    let refresh_token;
    let result;

    try {
        result = await user.save()
        // Token
        access_token = JwtServices.sign({ _id: result._id, role: result.role });
        refresh_token = JwtServices.sign({_id: result._id, role: result.role }, '1y' , REFRESH_SECRET)
        await RefreshToken.create({token:refresh_token})

    } catch (err) {
        return next(err)
    }
        res.json({ access_token, refresh_token, status : 200, result});
    }

}

export default register_controller