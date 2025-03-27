const otpGenerator = require('otp-generator');
const { transporter } = require('../configs/nodemailerConfig');
const { failResponse, successResponse } = require('./response');
const userModel = require('../models/UserModel');


exports.sendOtp = async (res, user) => {

    try {
        const generatedOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        let result = await userModel.updateOne({ email: user }, { otp: generatedOTP, otp_created_at: new Date() });
        console.log(result);


        const info = await transporter.sendMail({
            from: '"Jaiswal Retail Pvt. Ltd." <jayesh.developer546@gmail.com>', // sender address
            to: user, // list of receivers
            subject: "Your One-Time Password (OTP) for Secure Login", // Subject line
            text: "Your OTP is: 999999",
            html: `<div>
            <p>Hello Jayesh,</p>
    <p>Your One-Time Password (OTP) for login is:</p>
    <h2>${generatedOTP}</h2>
    
    <p>This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
    <p>If you didn’t request this OTP, please ignore this email.</p>
    
            <p>Thank You</p>
            <p>Jaiswal Retail Pvt. Ltd.,  <br/>G05, Electronic Complex, <br/>Indore (452010), Madhya Pradesh </p>
            </div>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        successResponse(res, 1, "Otp sent successfully");
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong");

    }

}



exports.sendOrderPlaced = async (result) => {
    console.log("I am sendOrderPlaced");
    let user = result.userId;
    let shippingDetails = result.shippingDetails;
    let src = (prop) => prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`;

    try {
        const info = await transporter.sendMail({
            from: '"Jaiswal Retail Pvt. Ltd." <jayesh.developer546@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: `Order Update- Ordered #${result.orderId}`, // Subject line
            text: "Order Placed Successfully",
            html: `<div>
            <p>Hello ${user.name.trim().split(" ")[0]},</p>
            <p>Order Placed Successfully<br/>Order Id: ${result.orderId}}</p>
            <div>Shipping Address:
                <p style="padding-left:10px; margin:0px;">${shippingDetails.name}<br/>
                ${shippingDetails.phone}<br/>
                ${shippingDetails.email}<br/>
                ${shippingDetails.flatHouseNo}, ${shippingDetails.areaStreet}<br/>
                (${shippingDetails.landmark}), ${shippingDetails.pincode}<br/>
                ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.country}<br/>
                </p>
            </div>

        <p>Total Amount: &#8377;${result.finalAmtToPay}/-<br/>
        Payment Mode: ${result.isPaymentModeOnline?`Online (Razorpay) <br/>Transaction Id: ${result.transactionDetails.razorpay_payment_id}`:'Cash On Delivery'}<br/>
        
        </p>

    
    <p>Items in order are:<p>
${result.cart.map((v, i) => `<div style="display:inline-block; position:relative">
<img src="${src(v)}" style="width:100px;margin:20px;"/>
<span style="position:absolute;top:0px;left:0px; text-align:right;">x${v.qty}</span>
</div>`).join('')}  

            <p>Thank You</p>
            <p>Jaiswal Retail Pvt. Ltd.,  <br/>G05, Electronic Complex, <br/>Indore (452010), Madhya Pradesh </p>
            </div>`, // html body
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.log(error);
        console.log("Message not sent");
    }
}

exports.sendShipmentStatus = async (result,message) => {
    console.log("I am sendShipmentStatus");
    let user = result.userId;
    // let shippingDetails = result.shippingDetails;
    let src = (prop) => prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`;
    try {
        const info = await transporter.sendMail({
            from: '"Jaiswal Retail Pvt. Ltd." <jayesh.developer546@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: `Order Update- ${message} #${result.orderId}`, // Subject line
            text: `Order status updated- ${message}`,
            html: `<div>
            <p>Hello ${user.name.trim().split(" ")[0]},</p>
            <p>Your order is- ${message} <br/>Order Id: ${result.orderId}}</p>
    
    <p>Items in order are:<p>
${result.cart.map((v, i) => `<div style="display:inline-block; position:relative">
<img src="${src(v)}" style="width:100px;margin:20px;"/>
<span style="position:absolute;top:0px;left:0px; text-align:right;">x${v.qty}</span>
</div>`).join('')}  

            <p>Thank You</p>
            <p>Jaiswal Retail Pvt. Ltd.,  <br/>G05, Electronic Complex, <br/>Indore (452010), Madhya Pradesh </p>
            </div>`, // html body
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.log(error);
        console.log("Message not sent");
    }
}



// shippingInfo: {
//     name: 'Mohit Jaiswal',
//     phone: '9399795689',
//     email: 'jayeshjaiswal1960@gmail.com',
//     flatHouseNo: '01',
//     areaStreet: 'Vinayak Avenue',
//     landmark: 'Near Nimad Hotel',
//     pincode: '451115',
//     city: 'Barwaha',
//     state: 'MP',
//     country: 'India',
//     paymentMode: 'cod'
// finalAmtToPay: