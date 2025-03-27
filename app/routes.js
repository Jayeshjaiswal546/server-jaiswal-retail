let expreess = require('express');
const userRouter = require('./routes/UserRouter');
const adminRouter = require('./routes/adminRouter');
const productRouter = require('./routes/productRouter');
const orderRouter = require('./routes/orderRouter');
let router = expreess.Router();

router.use('/user',userRouter);
router.use('/admin',adminRouter);
router.use('/product',productRouter);
router.use('/order',orderRouter);

// router.get('/',(req,res)=>{
//     res.send("Hello i am route.js file");
// })

module.exports = router;