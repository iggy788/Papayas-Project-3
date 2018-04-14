// Copy this file as config.js in the same folder, with the proper database connection URI.

module.exports = {
  db: process.env.MONGODB_URI || 'mongodb://username:password@url:port/db',
  db_dev: 'mongodb://localhost/login_demo'
};