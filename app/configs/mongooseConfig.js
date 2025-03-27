const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jayeshjaiswal546:mNOLCDLZJCRByF8x@cluster0.517wp.mongodb.net/jaiswal-retail-db?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log("Connection to mongodb cloud database successfull");
})
