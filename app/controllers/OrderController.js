const { successResponse, failResponse, successResponseWithData } = require("../functions/response");
const orderModel = require("../models/OrderModel");
const generateUniqueId = require('generate-unique-id');
const userModel = require("../models/UserModel");
const rzpInstance = require("../configs/razorpay-config");
const crypto = require("crypto");
const { sendOrderPlaced, sendShipmentStatus } = require("../functions/sendMail");

exports.createOrder = async (req, res) => {
    console.log("Api hit: Create Order");
    console.log(req.body);
    let isPaymentOnline = req.body.shippingInfo.paymentMode == 'online';
    const orderId = generateUniqueId().toUpperCase();



    try {
        let user = await userModel.findOne({ token: req.body.token });

        const tempObj = {
            userId: user._id,
            orderId: orderId,
            cart: req.body.cart,
            mrpTotal: req.body.mrpTotal,
            discountAmt: req.body.discountAmt,
            deliveryChg: req.body.deliveryChg,
            securedShippingFee: req.body.securedShippingFee,
            finalAmtToPay: req.body.finalAmtToPay,
            // orderStatus: isPaymentOnline ? 2 : 1,
            shipmentStatus: 0,
            shippingDetails: req.body.shippingInfo,
            isPaymentModeOnline: isPaymentOnline,
            //    transactionDetails: mongoose.Schema.Types.Mixed,
            //    isTransactionValid: Boolean
        };

        let newOrder, result;
        if (isPaymentOnline) {
            var options = {
                amount: req.body.finalAmtToPay * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                receipt: orderId
            };
            rzpInstance.orders.create(options, async function (err, order) {
                // console.log("Below is the orderid from razorpay");
                // console.log(order);
                newOrder = new orderModel({
                    ...tempObj,
                    transactionDetails: { razorpay_order_id: order.id }
                });
                result = await newOrder.save();
                console.log(result);
                if (result) {
                    successResponseWithData(res, 1, "Order Created Successfully", { orderId: result.orderId, razorpay_order_id: order.id });
                } else {
                    failResponse(res, 0, "Something went xrong");
                }
            });
        } else {
            newOrder = new orderModel(tempObj);
            result = await newOrder.save();
            console.log(result);
            if (result) {
                successResponseWithData(res, 1, "Order Created Successfully", { orderId: result.orderId });
            } else {
                failResponse(res, 0, "Something went xrong");
            }
        }


    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong");
    }
}

exports.viewOrder = async (req, res) => {
    console.log("Api hit: View Order");
    console.log(req.params);
    let result;
    try {

        if (req.params.orderId) {
            console.log('Request with orderId');
            result = await orderModel.findOne({ orderId: req.params.orderId });
            // console.log(result);
        } else {
            console.log('Request without orderId');
            result = await orderModel.find().populate('userId');
            result = result.filter(order => order.orderStatus == 1);

        }

        if (result) {
            successResponseWithData(res, 1, "Order details fetched successfully", result);
        } else {
            failResponse(res, 0, "Something went xrong");
        }

    } catch (error) {
        failResponse(res, 0, "Something went xrong");
    }
}

exports.placeCodOrder = async (req, res) => {
    console.log("Api hit: Place COD Order");
    try {
        let result = await orderModel.findOneAndUpdate({ orderId: req.params.orderId }, { orderStatus: 1 }, { returnDocument: "after" }).populate('userId');
        console.log(result);
        if (result) {
            successResponseWithData(res, 1, "COD order placed successfully", result);
            sendOrderPlaced(result);
        } else {
            failResponse(res, 0, "Something went xrong");
        }
    } catch (error) {
        failResponse(res, 0, "Something went xrong");
    }
}

exports.placePrepaidOrder = async (req, res) => {
    console.log("Api hit: Place Prepaid Order");
    try {
        let isTransactionValid = VerifyPayment(req.body.razorpay_response);
        let result = await orderModel.findOneAndUpdate({ orderId: req.params.orderId }, { orderStatus: 1, transactionDetails: req.body.razorpay_response, isTransactionValid }, { returnDocument: "after" }).populate('userId');
        console.log(result);
        if (result) {
            successResponseWithData(res, 1, "Prepaid order placed successfully", result);
            sendOrderPlaced(result);
        } else {
            failResponse(res, 0, "Something went xrong");
        }
    } catch (error) {
        console.log(error);
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}

function VerifyPayment(rzpResponse) {
    const generatedSignature = crypto.createHmac("sha256", "nAsQWp3rrKQQmEr0yKUru7ko")
        .update(rzpResponse.razorpay_order_id + "|" + rzpResponse.razorpay_payment_id)
        .digest("hex");
    return generatedSignature == rzpResponse.razorpay_signature;
}


exports.userOrders = async (req, res) => {
    console.log("Api hit: View User Orders");
    console.log(req.params.userToken);

    try {
        let result = await orderModel.find().populate({
            path: 'userId',
            match: { token: req.params.userToken },
        });

        result = result.filter(order => order.userId && order.orderStatus == 1);

        // console.log("Below is the orders of user");
        // console.log(result);
        if (result) {
            successResponseWithData(res, 1, "User Orders fetched successfully", result);
        } else {
            failResponse(res, 0, "Something went xrong");
        }
    } catch (error) {
        failResponse(res, 0, "Something went xrong");
    }
}

exports.updateShipmentStatus = async (req, res) => {
    console.log("Api hit: Update shipment status");
    // console.log(req.params.userToken);
    console.log(req.params.orderId);
    console.log(req.params.status);

    try {
        let result = await orderModel.findOneAndUpdate({ orderId: req.params.orderId }, { shipmentStatus: req.params.status }, { returnDocument: "after" }).populate('userId');
        console.log(result);
        if (result) {
            successResponseWithData(res, 1, "Shipment status updated", result);
            sendShipmentStatus(result,getOrderStatus(req.params.status));
        } else {
            failResponse(res, 0, "Something went xrong");
        }
    } catch (error) {
        failResponse(res, 0, "Something went xrong [catch error]");
    }
}

function getOrderStatus(statusCode) {
    const statusEnum = {
        0: "Pending",
        1: "Prepare To Ship",
        2: "Shipped",
        3: "Out for Delivery",
        4: "Delivered",
        5: "Cancelled"
    };
    return statusEnum[statusCode] || "Invalid Status";
}



exports.viewTransactions = async (req, res) => {
    console.log("Api hit: View Razorpay Transactions");
    try {
        let result = await orderModel.find({isPaymentModeOnline:true,orderStatus:1}).populate('userId');

        if (result) {
            successResponseWithData(res, 1, "Transactions fetched successfully", result);
        } else {
            failResponse(res, 0, "Something went xrong");
        }
    } catch (error) {
        failResponse(res, 0, "Something went xrong [catch]");
    }
}
