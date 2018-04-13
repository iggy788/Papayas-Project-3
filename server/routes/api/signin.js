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

  /*
   ** Sign In Route
   */
  app.post('/api/account/signin', (req, res, next) => {

    const {body} = req;
    const {password} = body;
    let {email} = body;

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

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid Password!'
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid Password!'
        });
      }

      // Otherwise Correct Password Entered Associated to User
      const userSession = new UserSession();
      userSession.userID = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server Error'
          });
        }

        return res.send({
          success: true,
          message: 'Valid Sign In',
          token: doc._id
        });
      }); // End Sign In Route

    });
  });

  /*
   ** Verify Sign In
   */
  app.get('/api/account/verify', (req, res, next) => {
    // Get Token
    const {
      query
    } = req;
    // ?token=test
    const {
      token
    } = query;

    // Verify the Token is Unique and NOT Deleted
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      } else if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        return res.send({
          success: true,
          message: 'You\'re Good'
        });
      }
    });
  }); // End Verify Token

  /*
   ** Logout
   */
  app.get('/api/account/logout', (req, res, next) => {
	// Get Token
	// token=test
    const {query} = req;
    const {token} = query;

    // Verify the Token is Unique and NOT Deleted
	  UserSession.findOneAndUpdate(
		  {
			  _id: token,
			  isDeleted: false
		  },
		  {
			  $set: {
				  isDeleted: true
			  }
		  }, null, (err, sessions) => {
			  if (err) {
				  return res.send(
					  {
						  success: false,
						  message: 'Error: Server Error'
					  });
			  } else {
				  return res.send(
					  {
						  success: true,
						  message: 'You\'re Good'
					  }
				  );
			  }
		  }
	  );
	}); // End Logout
};
