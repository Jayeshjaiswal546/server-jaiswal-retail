const mongoose = require('mongoose');
const userModel = require('./UserModel.js');
// const categoryModel = require('./CategoryModel.js');

require('../configs/mongooseConfig.js');

const orderSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.ObjectId, ref:userModel},
    orderId: String,
    cart: Array,
    mrpTotal: Number,
    discountAmt: Number,
    deliveryChg:Number,
    securedShippingFee:Number,
    finalAmtToPay: Number,
    orderStatus:{
        type: Number,
        enum: [0,1,2],
        default: 2
        //0:Failed, 1:Placed, 2:Pending
    },
    shipmentStatus: {
        type: Number,
        enum: [0,1,2,3,4,5]
        //0:Pending, 1:Prepare To Ship, 2:Shipped, 3:Out for delivery, 4:Delivered, 5:Cancelled
    },
    shippingDetails: mongoose.Schema.Types.Mixed,
    isPaymentModeOnline: Boolean,
    transactionDetails: mongoose.Schema.Types.Mixed,
    isTransactionValid: Boolean
},{timestamps:true})

const orderModel = mongoose.model('orders', orderSchema);
module.exports = orderModel;




