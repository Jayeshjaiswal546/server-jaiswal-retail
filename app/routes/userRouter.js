const express = require('express');
const { login, register, verifyEmail, resendLoginOTP, verifyLoginOTP, registerWithGoogle, loginWithGoogle, updateCart } = require('../controllers/UserController');
const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register',register);
userRouter.post('/verify-email',verifyEmail);
userRouter.post('/resend-login-otp',resendLoginOTP);
userRouter.post('/verify-login-otp',verifyLoginOTP);
userRouter.post('/register-with-google',registerWithGoogle);
userRouter.post('/login-with-google',loginWithGoogle);
userRouter.post('/update-cart',updateCart);



// userRouter.get('/login',(req,res)=>{
//     res.send("Hello i am userRouter.js file");
// })


module.exports = userRouter;