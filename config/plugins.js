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
            service: 'gmail',
            auth: {
              user: env('SMTP_USERNAME'),
              pass: env('SMTP_PASSWORD'),
            },
            // ... any custom nodemailer options
          },
          settings: {
            defaultFrom: env('SMTP_USERNAME'),
            defaultReplyTo: env('SMTP_USERNAME'),
          },
        },
      },
});

