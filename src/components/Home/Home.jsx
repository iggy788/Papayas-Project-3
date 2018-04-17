import React, { Component } from 'react';
import { getFromStorage, setInStorage } from 'utils/storage.jsx';
import 'whatwg-fetch';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpError: '',
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: ''
    };

/////********************************************************
    // Bind to React Component
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(
      this
    );
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(
      this
    );
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(
      this
    );
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(
      this
    );
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(
      this
    );
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(
      this
    );

    this.onSignUp = this.onSignUp.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.logout = this.logout.bind(this);
  }

/////********************************************************
// Initialization that requires DOM nodes should go here is invoked immediately after a component is mounted
// Calling setState() in this method will trigger an extra rendering, but it will happen before the browser updates the screen.
  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify Token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  // Sign Up Function
  onSignUp() {
    // Grab State
    const {
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName
    } = this.state;

    this.setState({
      isLoading: true
    });
    // POST Request to Backend.
    fetch('api/account/signup', {
      method: 'POST',
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: ''
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false
          });
        }
      });
  }
  /////********************************************************
  // Sign In Function
  onSignIn() {
    // Grab State
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true
    });

    // POST Request to Backend.
    fetch('api/account/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false
          });
        }
      });
  }
/////********************************************************
  // Logout Function
  logout() {
    this.setState({
      isLoading: true
    });
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Logout Takes a Query Param of Token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }
/////********************************************************
  // Functions that Occurs When the Event Parameter Changes the Props State
  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value
    });
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value
    });
  }
/////********************************************************
  // Rendering the Current State of Home Class
  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpError,
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!token) {
      return (
        <div>
          <div>
            {signInError ? <p>{signInError}</p> : null}
            <p>Sign In!</p>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
            <button onClick={this.onSignIn}>Sign In!</button>
          </div>
          <br />
          <br />
          <div>
            {signUpError ? <p>{signUpError}</p> : null}
            <p>Sign Up!</p>
            <input
              type="text"
              placeholder="First Name"
              value={signUpFirstName}
              onChange={this.onTextboxChangeSignUpFirstName}
            />
            <br />
            <input
              type="text"
              placeholder="Last Name"
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            />
            <br />
            <button onClick={this.onSignUp}>Sign Up!</button>
          </div>
        </div>
      );
    }
    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>Log Out!</button>
      </div>
    );
  }
}

export default Home;