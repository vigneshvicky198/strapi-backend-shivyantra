const { generateOTP, sendOTPMessage } = require('../../../utils/otpUtils');

module.exports = {
    async verifyOTP(ctx) {
        const { emailId, otp } = ctx.request.body;
       console.log(emailId, otp); 
        if (!emailId || !otp) {
          return ctx.badRequest('Phone number and OTP are required');
        }
    
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { 'email':emailId },
        });
    console.log(user);
        if (!user) {
          return ctx.notFound('User not found');
        }
    
        if (user.otp != otp) {
          console.log('Invalid Otp');
          return ctx.badRequest('Invalid OTP');
        }
       console.log(user.otpExpires,'otpExpires');
       console.log(Date.now(),'Current time');
        if(Date.now()>user.otpExpires){
          console.log('Otp is expired');
          return ctx.badRequest('OTP is expired');
        }
    
        // OTP is valid
        // You may want to finalize user registration here, e.g., by updating user status
        await strapi.db.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: {
            otp: null, // Clear OTP
            otpExpires: null, // Clear OTP expiration
            confirmed:true
          },
        });
    
        ctx.send({ message: 'OTP verified successfully' });
      },
      
      async resendOtp(ctx){
        const { emailId } = ctx.request.body;
        console.log(emailId); 
        if (!emailId ) {
          return ctx.badRequest('Email is required for resend otp');
        }
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
          where: { 'email':emailId },
        });
    console.log(user);
        if (!user) {
          return ctx.notFound('User not found');
        }
        const otp = generateOTP();
        console.log('otp:', otp);
        try {
          await sendOTPMessage(emailId, otp);
          // You may want to store the OTP and its expiration time in a secure way
          // e.g., in a database or temporary cache
          // For demonstration, we'll store it in the data object
          const updateUser = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
            data: {
              otp: otp,
              otpExpires:Date.now() + 0.5 * 60 * 1000
            },
          });
        } catch (error) {
          throw new Error('Failed to send OTP');
        }
        ctx.send({ message: 'OTP sent successfully' });
      }
}
