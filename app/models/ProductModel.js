const mongoose = require('mongoose');
const categoryModel = require('./CategoryModel.js');

require('../configs/mongooseConfig.js');

const productSchema = new mongoose.Schema({
    title:String, 
    description:String,
    mrp:Number,
    discountPercentage: Number,
    brand:String, 
    warrantyInformation:String,
    shippingInformation:String,
    category:{type:mongoose.Schema.Types.ObjectId, ref:categoryModel},
    availabilityStatus:Boolean,
    thumbnail: String,
    images: [String],
    rating:{type:Number, default:5},
    productBy:{type:String, default:'jayesh@jaiswalretail.com'}
},{timestamps:true})

const productModel = mongoose.model('product', productSchema);
module.exports = productModel;




