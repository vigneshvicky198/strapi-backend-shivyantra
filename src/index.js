'use strict';
const { sendOrderEmail } = require('./utils/orderEmail');
const { generateOTP, sendOTPMessage } = require('./utils/otpUtils');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],

      async beforeCreate(event) {
        const { data } = event.params;
        data.confirmed = false;
        // Ensure PhoneNumber is provided
        if (!data.email) {
          throw new Error('Email is required for OTP');
        }
        console.log(data.PhoneNumber);
    
        // Generate OTP
        const otp = generateOTP();
        console.log('otp:', otp);
        // Send OTP via SMS
        try {
          await sendOTPMessage(data.email, otp, data.username);
          // You may want to store the OTP and its expiration time in a secure way
          // e.g., in a database or temporary cache
          // For demonstration, we'll store it in the data object
          data.otp = otp;
          data.otpExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        } catch (error) {
          throw new Error('Failed to send OTP');
        }
      }
    });
  },
};
