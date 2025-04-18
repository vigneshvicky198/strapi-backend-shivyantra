// const twilio = require('twilio');
require('dotenv').config();

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const sendOTPMessage = async (emailId, otp, name) => {
    console.log(emailId,'sid');
    try{
      await strapi.plugins['email'].services.email.send({
        to: emailId,
        from: process.env.SMTP_USERNAME, // e.g. single sender verification in SendGrid
        // cc: 'valid email address',
        // bcc: 'valid email address',
        replyTo: process.env.SMTP_USERNAME,
        subject: 'Your Verification Code for Shivyantra',
        text: '${fieldName}', // Replace with a valid field ID
        html: `<p>Hi ${name},</p>
               <p>Greetings! Your verification code for Shivyantra is <span class="code">${otp}</span>. Please keep this code confidential and do not share it with anyone.</p>
               <p>Thank you,<br>Team Shivyantra</p>`, 
          
      })
  } catch(err) {
      console.log(err);
  }
};

module.exports = { generateOTP, sendOTPMessage };
