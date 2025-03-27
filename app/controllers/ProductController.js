const { successResponse, failResponse, successResponseWithData } = require("../functions/response");
const productModel = require("../models/ProductModel");
const { productdata } = require("../Test/productdata");
// const { categorySlugToId } = require("../Test/slug-id-mapping");


exports.addProduct = async (req, res) => {
    console.log("Api hit: Add Product");
    console.log(req.body);
    console.log("below is req.file");
    console.log(req.files);
    const newProduct = new productModel({
        title: req.body.title,
        description: req.body.description,
        mrp: req.body.mrp,
        discountPercentage: req.body.discountPercentage,
        brand: req.body.brand,
        warrantyInformation: req.body.warrantyInformation,
        shippingInformation: req.body.shippingInformation,
        category: req.body.category,
        availabilityStatus: req.body.availabilityStatus == 'In Stock' ? true : false,
        thumbnail: req.files.productThumbnail[0].filename,
        images: [
            req.files.miniImageInp1[0].filename,
            req.files.miniImageInp2[0].filename,
            req.files.miniImageInp3[0].filename,
            req.files.miniImageInp4[0].filename,
            req.files.miniImageInp5[0].filename,
            req.files.miniImageInp6[0].filename,
        ],
        // rating:{type:Number, default:5},
        // productBy:{type:String, default:'jayesh@jaiswalretail.com'
    });

    try {
        let result = await newProduct.save();
        console.log(result);
        if (result) {
            successResponse(res, 1, "Product Added Successfully");
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }

        // testing started.....
        // //    console.log(productdata);
        // productdata.map((v, i) => {
        //        console.log("start");
        //        console.log(v.category);
        //    console.log(categorySlugToId[v.category]);
        //     const newProduct = new productModel({
        //         title:v.title, 
        //         description:v.description,
        //         mrp:v.price*100,
        //         discountPercentage: v.discountPercentage,
        //         brand:v.brand, 
        //         warrantyInformation:v.warrantyInformation,
        //         shippingInformation:v.shippingInformation,
        //         category:categorySlugToId[v.category],
        //         availabilityStatus:true,
        //         thumbnail: v.thumbnail,
        //         images: [
        //             v.thumbnail,
        //             v.thumbnail,
        //             v.thumbnail,
        //             v.thumbnail,
        //             v.thumbnail,
        //             v.thumbnail,
        //         ],
        //         rating: v.rating,
        //         productBy:'dummyjson'
        //    });
        //    newProduct.save()
        //        .then(console.log("ok"));
        //    });
        //    successResponse(res, 1, "Test Success");
        // testing end.....

    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}

exports.viewProducts = async (req, res) => {
    console.log("Api hit: View Product");
    console.log("id start");
    console.log(req.params.id);
    console.log("id end");

    try {
        let result;
        if (req.params.id) {
            console.log("Api is hitted with id");
            result = await productModel.findById(req.params.id).populate("category");
        } else {
            console.log("Api hitted with NO id");
            result = await productModel.find().populate("category");
        }

        if (result) {
            successResponseWithData(res, 1, "Products Fetched Successfully", result);
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}


exports.deleteProduct = async (req, res) => {
    console.log("Api hit: Delete Product");
    try {
        let result = await productModel.findByIdAndDelete(req.body.id);
        console.log(result)
        if (result) {
            successResponse(res, 1, "Product Deleted Successfully");
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}

exports.editProduct = async (req, res) => {
    try {
        console.log("Api hit: Edit Product");
        // console.log(req.body);
        console.log(req.files);
        // console.log(req.params.id);
        let id = req.params.id;
        let storedData = await productModel.findById(id);
        // console.log("Below is stored data");
        // console.log(storedData);
        // console.log(storedData.images);
        let storedImages = storedData.images;
        let storedThumbnail = storedData.thumbnail;


        let temp = {
          
            title: req.body.title,
            description: req.body.description,
            mrp: req.body.mrp,
            discountPercentage: req.body.discountPercentage,
            brand: req.body.brand,
            warrantyInformation: req.body.warrantyInformation,
            shippingInformation: req.body.shippingInformation,
            category: req.body.category,
            availabilityStatus: req.body.availabilityStatus == 'In Stock' ? true : false,
            // thumbnail: req.files.productThumbnail[0].filename,
            // images: [
            //     req.files.miniImageInp1[0].filename,
            //     req.files.miniImageInp2[0].filename,
            //     req.files.miniImageInp3[0].filename,
            //     req.files.miniImageInp4[0].filename,
            //     req.files.miniImageInp5[0].filename,
            //     req.files.miniImageInp6[0].filename,
            // ],
        };
        let result;
        if (Object.keys(req.files).length) {
            console.log("file is present");
            if (req.files.productThumbnail) {
                storedThumbnail = req.files.productThumbnail[0].filename;
            }
            for (let i = 1; i <= 6; i++) {
                if (req.files[`miniImageInp${i}`]) {
                    storedImages[i - 1] = req.files[`miniImageInp${i}`][0].filename;
                }
            }
            result = await productModel.findByIdAndUpdate(id, {
                ...temp,
                thumbnail: storedThumbnail,
                images: storedImages
            }, { new: true });
        } else {
            console.log("file is absent");
            result = await productModel.findByIdAndUpdate(id, temp, { new: true });
        }


        console.log(result);
        if (result) {
            successResponse(res, 1, "Product Updated Successfully");
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}

exports.viewProductsByCategory = async (req, res) => {
    console.log("Api hit: View Product By Category");

    try {
        let result;
            result = await productModel.find({category:req.params.id}).populate("category");
        if (result) {
            successResponseWithData(res, 1, "Products of Category Fetched Successfully", result);
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}





