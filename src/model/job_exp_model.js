import mongoose from 'mongoose';
import User from './user_model';
const Schema = mongoose.Schema;

const job_expSchema = new Schema({
    job_title: {type:String},
    company_name: {type:String},
    job_duration: {type:String},
    level: {type:String},
    user_id: [{type: 'ObjectId', ref:'User'}],
}, {timestamps: true})

export default mongoose.model('Job_experience', job_expSchema, 'job_experience')



