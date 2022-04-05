import mongoose from 'mongoose';
import Layer from './layers_model';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {type: String},
    image: {type: String},
    last_name: {type: String},
    dob: {type: Date},
    city: {type: String},
    email: {type: String, unique: true, required: true},
    device_token: {type: String},
    device_type: {type: String},
    password : {type: String},
    layers: [{type: 'ObjectId', ref:'Layer'}],
    login_type: {type: String},
    social_token: {type: String},
    role: {type: String, default: 'user'}
}, {timestamps: true})

export default mongoose.model('User', userSchema, 'users')