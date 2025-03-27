const express = require('express');
const router = require('./app/routes');
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cors());
app.use(router);
app.use('/uploads', express.static('uploads')); 


// app.get('/',(req,res)=>{
//     res.send("Welcome to server");
// });


app.listen(8000,()=>{
    console.log("Server is running on port:8000");
    require('./cronjobs/otpExpire.js');
})
