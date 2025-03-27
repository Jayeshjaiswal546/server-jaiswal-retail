const { frontendBaseUrl } = require("../api/api.js");
const { transporter } = require("../configs/nodemailerConfig.js");
const { successResponse, failResponse, successResponseWithData } = require("../functions/response.js");
const userModel = require("../models/UserModel");
var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');
const { sendOtp } = require("../functions/sendMail.js");


exports.register = async (req, res) => {
    console.log("Api hit: Register user");
    console.log(req.body);
    var token = jwt.sign({ "email": req.body.email }, 'shhhhh546');

    const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: passwordHash.generate(req.body.password),
        token: token
    })

    try {
        let result = await newUser.save();
        console.log(result);
        const info = await transporter.sendMail({
            from: '"Jaiswal Retail Pvt. Ltd." <jayesh.developer546@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Please verify your email address", // Subject line
            text: `"Hello,
Please verify your email address by clicking on the following link:
[Verification Link]
If you did not request this, please ignore this email.

Thank you."`, // plain text body
            html: `<div>
        <p>Hello ${req.body.name.trim().split(' ')[0]},</p>
        <p>You registered an account on <a href="jaiswalretail.shop">jaiswalretail.shop</a>, before being able to use your account you need to verify that this is your email address by clicking here: <br/>
        <a href="${frontendBaseUrl}/auth/verify-email/${encodeURIComponent(req.body.email)}/${token}">
        ${frontendBaseUrl}/auth/verify-email/${encodeURIComponent(req.body.email)}/${token}
        </a>
        </p>
        <p>Thank You</p>
        <p>Jaiswal Retail Pvt. Ltd.,  <br/>G05, Electronic Complex, <br/>Indore (452010), Madhya Pradesh </p>
        </div>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        successResponse(res, 1, "Email verification link sent successfully");

    } catch (error) {
        console.log(error);
        if (error?.errorResponse?.code == 11000) {
            console.log("Email already exists");
            failResponse(res, 0, "Email already exists");
        } else {
            failResponse(res, 0, "Something went wrong");
        }
    }

}

exports.verifyEmail = async (req, res) => {
    console.log("Api hit: Verify email");
    console.log(req.body);
    try {
        let result = await userModel.findOne({ email: req.body.email });
        console.log(result);
        if (result.isEmailVerified) {
            successResponse(res, 1, "Email already verified");
        } else {
            if (result.token == req.body.token) {
                console.log("Token Matched");
                let result = await userModel.updateOne({ email: req.body.email }, { isEmailVerified: true });
                console.log(result);
                successResponse(res, 1, "Email verified successfully");
            } else {
                console.log("Token NOT Matched");
                failResponse(res, 1, "Invalid Token");
            }
        }
    } catch (err) {
        failResponse(res, 0, "Something went xrong");
    }

}


exports.login = async (req, res) => {
    console.log("Api hit: Login user");
    console.log(req.body);
    let result = await userModel.findOne({ email: req.body.email });
    console.log(result);

    try {
        if (result) {
            if (passwordHash.verify(req.body.password, result.password)) {
                console.log("Password matched");
                sendOtp(res, req.body.email);
            } else {
                console.log("Invalid password")
                failResponse(res, 0, "Invalid password");

            }
        } else {
            failResponse(res, 0, "User not found");
        }
    } catch (error) {
        console.log("Caught in catch");
        failResponse(res, 0, "Something went xrong");
    }
}

exports.resendLoginOTP = async (req, res) => {
    console.log("Api hit: Resend login otp");
    console.log(req.body);
    sendOtp(res, req.body.email);
    // successResponse(res,1,"Otp sent successfully");

}

exports.verifyLoginOTP = async (req, res) => {
    console.log("Api hit: Verify login OTP");
    console.log(req.body);
    let result = await userModel.findOne({ email: req.body.email });
    console.log(result);
    let name = result.name.split(' ')[0];
    if (result.otp == req.body.otp) {
        console.log("Valid OTP: OTP Matched");
        // successResponse(res,1,"Valid OTP");
        res.send({ status: 1, message: "Login successful", name, token: result.token, cart: result.cart });
    } else {
        console.log("Invalid OTP: OTP not match");
        failResponse(res, 0, "Invalid OTP");

    }
}

exports.registerWithGoogle = async (req, res) => {
    console.log("Api hit: Register with google");
    console.log(req.body);
    var token = jwt.sign({ "email": req.body.email }, 'shhhhh546');

    let result = await userModel.findOne({ email: req.body.email });
    if (!result) {
        const newUser = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash.generate(req.body.password),
            isEmailVerified: req.body.isEmailVerified,
            token: token
        })

        try {
            let result = await newUser.save();
            console.log(result);
            successResponse(res, 1, "Registration successful");
        } catch (error) {
            console.log(error);
            failResponse(res, 0, "Something went xrong");
        }
    } else {
        failResponse(res, 0, "Email already exists");
    }
}

exports.loginWithGoogle = async (req, res) => {
    console.log("Api hit: Login with google");
    console.log(req.body);
    let result = await userModel.findOne({ email: req.body.email });
    console.log(result);

    try {
        if (result) {
            console.log("User found");
            let name = result.name.split(' ')[0];
            res.send({ status: 1, message: "Login successful", name, token: result.token, cart: result.cart });
        }
        else {
            failResponse(res, 0, "User not found");
        }
    } catch (error) {
        console.log(error);
        console.log("Caught in catch");
        failResponse(res, 0, "Something went xrong");
    }
}

exports.updateCart = async (req, res) => {
    console.log("Api hit: Update Cart");
    // console.log(req.body);

    let cart = req.body.cart.map((v, i) => {
        let { category, images, ...newObj } = v;
        return newObj;
    });
    // console.log(cart)

    let result = await userModel.findOneAndUpdate({ token: req.body.token }, { cart: cart }, { returnDocument: "after" });
    console.log(result);

    try {
        if (result) {
            
            successResponseWithData(res,1,"Cart updated successfully on server",result.cart);
        }
        else {
            failResponse(res, 0, "User not found");
        }
    } catch (error) {
        console.log(error);
        console.log("Caught in catch");
        failResponse(res, 0, "Something went xrong");
    }
}