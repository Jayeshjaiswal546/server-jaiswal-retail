const mongoose = require('mongoose');

require('../configs/mongooseConfig.js');

const userSchema = new mongoose.Schema({
    name:String, 
    email: {type:String, unique:true},
    phone: {type:Number, default:9999999999},
    password: String,
    token:String,
    isEmailVerified:{type:Boolean, default:false},
    isPhoneVerified:{type:Boolean, default:false},
    cart:{type:Array, default:[]},
    otp:{type:Number, default:null},
    otp_created_at: {type:Date, default:null},
},{timestamps:true})

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;

