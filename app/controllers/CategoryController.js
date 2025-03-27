const { successResponse, failResponse, successResponseWithData } = require("../functions/response");
const categoryModel = require("../models/CategoryModel");
const { categoryData } = require("../Test/categorydata");


exports.addCategory = async (req, res) => {
    console.log("Api hit: Add Category");
    // console.log(req.body);
    // console.log(req.file);
    const newCategory = new categoryModel({
        categoryName: req.body.categoryName,
        categorySlug: req.body.categorySlug,
        categoryDesc: req.body.categoryDesc,
        categoryStatus: req.body.categoryStatus == 'Active' ? true : false,
        thumbnailFilename: req.file.filename,
        thumbnailFilepath: req.file.path
    });
    try {
        let result = await newCategory.save();
        console.log(result);
        if (result) {
            successResponse(res, 1, "Category Added Successfully");
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }

        // testing started.....
        // console.log(categoryData);
        // categoryData.map((v, i) => {
        //     console.log("hello");
        //     const newCategory = new categoryModel({
        //         categoryName: v.name,
        //         categorySlug: v.slug,
        //         categoryDesc: v.description,
        //         categoryStatus: true,
        //         thumbnailFilename: "1742054680474-722679071-8136031.png",
        //         thumbnailFilepath: "uploads1742054680474-722679071-8136031.png"
        //     });
        //     newCategory.save()
        //     .then(console.log("ok"));
        // // console.log(result);
        // });
        // successResponse(res, 1, "Test Success");
        // testing end.....
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}

exports.viewCategory = async (req, res) => {
    console.log("Api hit: View Category");
    // console.log("id start");
    // console.log(req.params.id);
    // console.log("id end");

    try {
        let result;
        if (req.params.id) {
            console.log("Api is hitted with id");
            result = await categoryModel.findById(req.params.id);
        } else {
            console.log("Api hitted with NO id");
            result = await categoryModel.find();
        }

        if (result) {
            successResponseWithData(res, 1, "Categories Fetched Successfully", result);
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}

exports.deleteCategory = async (req, res) => {
    console.log("Api hit: Delete Category");
    try {
        let result = await categoryModel.findByIdAndDelete(req.body.id);
        console.log(result)
        if (result) {
            successResponse(res, 1, "Category Deleted Successfully");
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}

exports.editCategory = async (req, res) => {
    try {
        console.log("Api hit: Edit Category");
        // console.log(req.body);
        // console.log(req.file);
        // console.log(req.params.id);
        let id = req.params.id;
        let temp = {
            categoryName: req.body.categoryName,
            categorySlug: req.body.categorySlug,
            categoryDesc: req.body.categoryDesc,
            categoryStatus: req.body.categoryStatus == 'Active' ? true : false,
        };
        let result;
        if (req.file) {
            // console.log("file is present");
            result = await categoryModel.findByIdAndUpdate(id, {
                ...temp,
                thumbnailFilename: req.file.filename,
                thumbnailFilepath: req.file.path
            }, {new:true});
        } else {
            // console.log("file is absent");
            result = await categoryModel.findByIdAndUpdate(id, temp,{new:true});
        }


        console.log(result);
        if (result) {
            successResponse(res, 1, "Category Updated Successfully");
        } else {
            failResponse(res, 0, "Something went xrong [else error]");
        }
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}
