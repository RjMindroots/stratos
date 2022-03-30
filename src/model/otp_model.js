import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email : {type: String},
    otp : {type: Number},
    expiry_otp:{type: Date}

}, {timestamps: true})

export default mongoose.model('Otp', otpSchema, 'otps')