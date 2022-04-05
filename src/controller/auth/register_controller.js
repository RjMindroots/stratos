import Joi from 'joi'
import bcrypt from 'bcrypt'
import { User, RefreshToken, Job_experience, Auth_Table, Layer } from "../../model"
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtServices from '../../services/JwtServices'
import { REFRESH_SECRET } from '../../config'

const register_controller = {
    async register(req, res, next) {
        const { email, password, first_name, last_name, dob, city, social_token, login_type, device_token, device_type, job_experience, layers} = req.body

        //requested data valid or not
        const registerSchema = Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }),
            first_name: Joi.string().required(),
            device_token:Joi.string().required(),
            device_type:Joi.string().required()
        })
        const { error } = registerSchema.validate({ email, first_name, device_token, device_type})
        if (error) {
            return next(error)
        }

        try {
            const userData = await User.findOne({ email: req.body.email })
            if (userData) {
                if(userData.login_type !== "4" && userData.social_token) {
                    return next(CustomErrorHandler.alreadyExist(`You are already registered with ${userData.login_type}`));
                } else {
                    return next(CustomErrorHandler.alreadyExist('This email is already exist'));
                }
            }
        } catch (err) {
            return next(err)
        }

        //hashpassword
        const hashedpassword = await bcrypt.hash(password, 16)
        let user 

        try {
            const abc = await Layer.find().where('layer_name').in(layers).exec();
            console.log(abc)
            return
        } catch (err) {
            console.log(err)
        }

        if(login_type === "4") {
            user = new User({
                email,
                password: hashedpassword,
                first_name,
                last_name,
                dob,
                city,
                login_type,
                device_type,
                layers
            })
        } else {
            user = new User({
                email,
                first_name,
                last_name,
                dob,
                city,
                social_token,
                login_type,
                device_type,
                layers
            })
        }

        let access_token;
        let refresh_token;
        let data;
        let experience

        try {
            data = await user.save()
            // Token
            access_token = JwtServices.sign({ _id: data._id, role: data.role });
            refresh_token = JwtServices.sign({ _id: data._id, role: data.role }, '1y', REFRESH_SECRET)
            await RefreshToken.create({ token: refresh_token })


            job_experience.forEach(function(element) {
                element.user_id = data._id
            });

            experience = await Job_experience.insertMany(job_experience, (err, docs) => {
            if(err) {
                console.log(err)
            } else {
                return docs
                console.log(docs)
            }
            })

            await Auth_Table.create({auth_code: access_token, device_token, device_type, user_id: data._id})

        } catch (err) {
            return next(err)
        }
        res.json({ access_token, refresh_token, status: 200, data, experience });
    }

}

export default register_controller