module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),  // This makes the server accessible on localhost
  port: env.int('PORT', 1342), 
  url:'https://api.shivyantra.com',
  app: {
    keys: env.array('APP_KEYS'),
  },   // You can change this if you want a different port
});
