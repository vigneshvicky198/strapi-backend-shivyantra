module.exports = ({ env }) => ({

    
      upload: {
        config: {
          sizeLimit: 3000 * 1024 * 1024 // 3GB in bytes
        }
      },
      email: {
        config: {
          provider: 'nodemailer',
          providerOptions: {
            host: 'smtp.gmail.com',  // SMTP Host
            port: 465,               // SSL Port (use 587 for TLS)
            secure: true,            // Set to true for SSL
            auth: {
              user: env('GMAIL_USER'),    // Gmail address (e.g., your-email@gmail.com)
              pass: env('GMAIL_APP_PASSWORD'),  // Your generated App Password
            },
          },
          settings: {
            defaultFrom: env('GMAIL_USER'), // Default sender email address
            defaultReplyTo: env('GMAIL_USER'),
          },
        },
      },
});

