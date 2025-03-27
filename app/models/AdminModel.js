const mongoose = require('mongoose');

require('../configs/mongooseConfig.js');

const adminSchema = new mongoose.Schema({
    username:String, 
    password: String,
    token:String
},{timestamps:true})

const adminModel = mongoose.model('admins', adminSchema);
module.exports = adminModel;




