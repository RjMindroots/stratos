import mongoose from 'mongoose';
import User from './user_model';
const Schema = mongoose.Schema;

const authSchema = new Schema({
    auth_code: {type:String},
    device_token: {type:String},
    device_type: {type:String},
    user_id: [{type: 'ObjectId', ref:'User'}],
}, {timestamps: true})

export default mongoose.model('Auth_Table', authSchema, 'auth_table')