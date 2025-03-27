const express = require('express');
const { addProduct, viewProducts, deleteProduct, editProduct, viewProductsByCategory } = require('../controllers/ProductController');
const { upload } = require('../configs/multerConfig');
const productRouter = express.Router();

productRouter.post('/add-product', upload.fields(
    [{ name: "productThumbnail" },
    { name: "miniImageInp1" },
    { name: "miniImageInp2" },
    { name: "miniImageInp3" },
    { name: "miniImageInp4" },
    { name: "miniImageInp5" },
    { name: "miniImageInp6" },
    ]), addProduct);

productRouter.post('/edit-product/:id', upload.fields(
    [{ name: "productThumbnail" },
    { name: "miniImageInp1" },
    { name: "miniImageInp2" },
    { name: "miniImageInp3" },
    { name: "miniImageInp4" },
    { name: "miniImageInp5" },
    { name: "miniImageInp6" },
    ]), editProduct);

productRouter.get('/view-product/:id?', viewProducts);
productRouter.post('/delete-product', deleteProduct);
productRouter.get('/view-product-by-category/:id?', viewProductsByCategory);







module.exports = productRouter;