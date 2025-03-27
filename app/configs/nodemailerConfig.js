const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "jayesh.developer546@gmail.com",
        pass: "hxdzcpvnoqhrykfg",
    },
});
