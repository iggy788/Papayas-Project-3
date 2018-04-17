import React, { Component } from 'react';
import {
	Route,
    Switch,
	Redirect
} from 'react-router-dom';
// import NotificationSystem from 'react-notification-system';

import { getFromStorage, setInStorage } from 'utils/storage';
import 'whatwg-fetch';
// import App from 'components/App/App';
// import NotFound from 'components/App/NotFound';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import Sidebar from 'components/Sidebar/Sidebar';
// import Home from 'components/Home/Home';

// import {style} from "variables/Variables.jsx";

import appRoutes from 'routes/app.jsx';


// // API routes
// require('../../server/routes')(app);
class App extends Component {
    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        // this.handleNotificationClick = this.handleNotificationClick.bind(this);
        this.state = {
			// _notificationSystem: null
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
    // handleNotificationClick(position){
    //     var color = Math.floor((Math.random() * 4) + 1);
    //     var level;
    //     switch (color) {
    //         case 1:
    //             level = 'success';
    //             break;
    //         case 2:
    //             level = 'warning';
    //             break;
    //         case 3:
    //             level = 'error';
    //             break;
    //         case 4:
    //             level = 'info';
    //             break;
    //         default:
    //             break;
    //     }
    //     this.state._notificationSystem.addNotification({
    //         title: (<span data-notify="icon" className="pe-7s-gift"></span>),
    //         message: (
    //             <div>
    //                 Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for every web developer.
    //             </div>
    //         ),
    //         level: level,
    //         position: position,
    //         autoDismiss: 15,
    //     });
    // }

        // this.setState({_notificationSystem: this.refs.notificationSystem});
        // var _notificationSystem = this.refs.notificationSystem;
        // var color = Math.floor((Math.random() * 4) + 1);
        // var level;
        // switch (color) {
        //     case 1:
        //         level = 'success';
        //         break;
        //     case 2:
        //         level = 'warning';
        //         break;
        //     case 3:
        //         level = 'error';
        //         break;
        //     case 4:
        //         level = 'info';
        //         break;
        //     default:
        //         break;
        // }
        // _notificationSystem.addNotification({
        //     title: (<span data-notify="icon" className="pe-7s-gift"></span>),
        //     message: (
        //         <div>
        //             Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for every web developer.
        //         </div>
        //     ),
        //     level: level,
        //     position: "tr",
        //     autoDismiss: 15,
		// });
		/////********************************************************
		// Initialization that requires DOM nodes should go here is invoked immediately after a component is mounted
		// Calling setState() in this method will trigger an extra rendering, but it will happen before the browser updates the screen.
	componentDidMount() {
		const obj = getFromStorage('the_main_app');
		console.log(obj);

		if (obj && obj.token) {
			const { token } = obj;
			console.log(token);
			// Verify Token
			fetch('api/account/verify?token=' + token)
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
	componentDidUpdate(e){
	    if(window.innerWidth < 993 && e.history.location.pathname !== e.location.pathname && document.documentElement.className.indexOf('nav-open') !== -1){
	        document.documentElement.classList.toggle('nav-open');
	    }
	}
	/////********************************************************
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
		console.log(this.state);
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
		// .then(res => res.json())
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

		console.log(this.state);
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
		// .then(res => res.json())
		.then(json => {
			if (json.success) {
			setInStorage('the_main_app', { token: json.token });
			console.log(setInStorage);
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
		fetch('api/account/logout?token=' + token)
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

                <div className="wrapper">

                    <Sidebar {...this.props} />
                    <div id="main-panel" className="main-panel">
                        <Header {...this.props}/>
                            <Switch>
                                {
                                    appRoutes.map((prop,key) => {
                                        if(prop.name === "Notifications")
                                            return (
                                                <Route
                                                    path={prop.path}
                                                    key={key}
                                                    render={routeProps =>
                                                       <prop.component
                                                           {...routeProps}
                                                           handleClick={this.handleNotificationClick}
                                                       />}
                                                />
                                            );
                                        if(prop.redirect)
                                            return (
                                                <Redirect from={prop.path} to={prop.to} key={key}/>
                                            );
                                        return (
                                            <Route path={prop.path} component={prop.component} key={key}/>
                                        );
                                    })
                                }
                            </Switch>
                        <Footer />
                    </div>
                </div>
        );
    }
}

export default App;
