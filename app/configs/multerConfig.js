const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads');
    },
    filename: function(req,file,cb){
        console.log(file);
        cb(null,Date.now()+'-'+Math.round(Math.random()*1E9)+'-'+file.originalname);
    }
});

exports.upload = multer({storage:storage});