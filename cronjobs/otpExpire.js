var cron = require('node-cron');
const userModel = require('../app/models/UserModel');

console.log("Cron job to remove expired OTPs started...");

cron.schedule('* * * * *',async () => {
    console.log('Removing expired OTPs...');

    try {
        let result = await userModel.updateMany(
            { otp_created_at: { $lte: new Date(Date.now() - 10 * 60 * 1000) } }, 
            { $set: { otp: null } }
        );
        console.log(result);
        console.log("Alert: Expired OTPs cleared.");
    } catch (error) {
        console.error("Error clearing OTPs:", error);
    }

  });



