const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
	/*
   ** Sign Up Route
   */
  app.post('/api/account/signup', (req, res, next) => {
    const {body} = req;

    const {firstName,lastName,password} = body;

    let {email} = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error: First Name Cannot be Blank!'
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: 'Error: Last Name Cannot be Blank!'
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email Cannot be Blank!'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password Cannot be Blank!'
      });
    }
    email = email.toLowerCase();

    // Steps:
    // 1. Verify Email Doesn't Exist
    // 2. Save
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Account Already Exists!'
        });
      }

      // Save New User
      const newUser = new User();

      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server Error'
          });
        }
        return res.send({
          success: true,
          message: 'Signed Up!'
        });
      });
    });
  });
  // End Sign Up Route
};