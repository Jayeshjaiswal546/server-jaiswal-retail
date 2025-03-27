const express = require('express');
const { registerAdmin, loginAdmin } = require('../controllers/AdminController');
const { addCategory, viewCategory, deleteCategory, editCategory } = require('../controllers/CategoryController');
const { upload } = require('../configs/multerConfig.js');
const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.post('/register',registerAdmin);
adminRouter.post('/add-category',upload.single('categoryThumbnail'),addCategory);
adminRouter.post('/edit-category/:id',upload.single('categoryThumbnail'),editCategory);
adminRouter.get('/view-category/:id?',viewCategory);
adminRouter.post('/delete-category',deleteCategory);





// userRouter.get('/login',(req,res)=>{
//     res.send("Hello i am userRouter.js file");
// })

module.exports = adminRouter;