import React from 'react';
import { signUpRequest, signInRequest, getRefreshedToken, getMe } from './serverRequests';
import './page.css';


class AuthorizationPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        email: '',
        password: '',
        authorized: false,
        error: false,
    };
  }

  componentDidMount = async () => {
    this.setState({ error: false });
    const content = await getMe();
    switch (content) {
        case 'expiredToken':
            const refreshResponse = await getRefreshedToken();
            if (refreshResponse === 'error') {
              localStorage.setItem('refreshToken', '');
              localStorage.setItem('token', '');
              this.setState({ authorized: false });
            } else {
              this.setState({ authorized: true });
            }
            break;
        case 'authorized':
            this.setState({ authorized: true });
            break;
        default:
            localStorage.setItem('refreshToken', '');
            localStorage.setItem('token', '');
            this.setState({ authorized: false });
    }
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  signUp = async () => {
    const signUpResponse = await signUpRequest({ email: this.state.email, password: this.state.password });
    if (signUpResponse === "ok") {
        this.login();
    } else {
        this.setState({ error: true });
    }
  }

  login = async () => {
    const signInResponse = await signInRequest(this.state.email, this.state.password);
    if (signInResponse === "ok") {
        this.setState({ authorized: true, error: false });
    } else {
        this.setState({ error: true });
    }
  } 

  signOut = () => {
      localStorage.clear();
      this.setState({ authorized: false });
  }
  render() {   
    if (this.state.authorized) {
        return (
            <div className="page-container">
                <p>Token is valid</p>
                <button className="btn" onClick={this.signOut} >sign out</button>
            </div>
        )
    }
    
    return (
        <div className="page-container">  
            <form id="authorization-form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" name="email" value={this.state.email} placeholder="Email" required={true} onChange={this.onChangeEmail} />
                <input type="password" name="pass" value={this.state.password} placeholder="Password" required={true} onChange={this.onChangePassword} />
                <button className="signup-btn btn" form="authorization-form" onClick={this.signUp} >sign up</button>
                <button className="login-btn btn" form="authorization-form" onClick={this.login} >login</button>
            </form>
            {this.state.error ? <p className="errorMessage">something went wrong</p> : null}
        </div>
    )

  }
}

export default AuthorizationPage;
