const mongoose = require('mongoose');

require('../configs/mongooseConfig.js');

const categorySchema = new mongoose.Schema({
    categoryName:String, 
    categorySlug: String,
    categoryDesc:String,
    categoryStatus:Boolean,
    thumbnailFilename:String, 
    thumbnailFilepath:String
},{timestamps:true})

const categoryModel = mongoose.model('categories', categorySchema);
module.exports = categoryModel;




