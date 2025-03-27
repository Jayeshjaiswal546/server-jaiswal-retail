const express = require('express');
const { createOrder, viewOrder, placeCodOrder, placePrepaidOrder, userOrders, updateShipmentStatus, viewTransactions } = require('../controllers/OrderController');

const orderRouter = express.Router();

orderRouter.post('/create-order', createOrder);
orderRouter.get('/view-order/:orderId?', viewOrder);
orderRouter.get('/user-orders/:userToken/:orderId?', userOrders);
orderRouter.get('/place-cod-order/:orderId', placeCodOrder);
orderRouter.post('/place-prepaid-order/:orderId', placePrepaidOrder);
orderRouter.get('/update-shipment-status/:orderId/:status', updateShipmentStatus);
orderRouter.get('/view-transactions', viewTransactions);


// orderRouter.get('/login',(req,res)=>{
//     res.send("Hello i am orderRouter.js file");
// })


module.exports = orderRouter;