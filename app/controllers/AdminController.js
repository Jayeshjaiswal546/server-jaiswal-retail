const { successResponse, failResponse } = require("../functions/response");
const adminModel = require("../models/AdminModel");
var jwt = require('jsonwebtoken');


exports.registerAdmin = async (req,res)=>{
    console.log("Api hit: Register admin");
    console.log(req.body);
    var token = jwt.sign({ "username": req.body.username }, 'shhhhh546');
    
    const newAdmin = new adminModel({
        username: req.body.username,
        password: req.body.password,
        token:token
    });

    try{
        let result = await newAdmin.save();
        console.log(result);
        if(result){
            successResponse(res,1,"Admin Registered Successfully");
        }else{
            failResponse(res,0,"Something went xrong");
        }

    }catch(error){
        failResponse(res,0,"Something went xrong");
    }
}

exports.loginAdmin = async (req,res)=>{
    console.log("Api hit: Login admin");
    console.log(req.body);
    try{
        let result = await adminModel.findOne({username:req.body.username});
        console.log(result);
        if(result){
            if(result.password==req.body.password){
                // successResponse(res,1,"Login Successful");
                res.send({ status: 1, message: "Login successful", token: result.token});
                
            }else{
                failResponse(res,0,"Invalid password");
            }
        }else{
            failResponse(res,0,"Admin not found");
        }
        
    }catch(error){
        console.log(error);
        failResponse(res,0,"Something went xrong");
    }
}