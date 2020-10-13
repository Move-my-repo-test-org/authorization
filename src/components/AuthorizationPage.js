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
    };
  }

  componentDidMount = async () => {
    const content = await getMe();
    if (content === 'expiredToken') {
        this.setState({isLoading: true})
        getRefreshedToken()
        this.setState({authorized: true, isLoading: false})
    } else if (content === 'authorized') {
        this.setState({authorized: true, isLoading: false});
    } else {
        localStorage.setItem('refreshToken', '');
        localStorage.setItem('token', '');
        this.setState({authorized: false});
    }
  }

  onChangeEmail = (e) => {
    this.setState({email: e.target.value});
  }

  onChangePassword = (e) => {
    this.setState({password: e.target.value});
  }

  signUp = () => {
    signUpRequest({email: this.state.email, password: this.state.password});
  }

  login = () => {
    signInRequest(this.state.email, this.state.password);
    this.setState({authorized: true});
  } 

  signOut = () => {
      localStorage.clear();
      this.setState({authorized: false});
  }
  render() {
    if (this.state.isLoading) {
        return (
            <div className="page-container">
                <p>Loading...</p>
            </div>
        )
    } else if (this.state.authorized) {
        return (
            <div className="page-container">
                <p>Token is valid</p>
                <button className="btn" onClick={this.signOut} >sign out</button>
            </div>
        )
    }
    
    return (
        <div className="page-container">  
            <form id="authorization-form" >
                <input type="text" name="email" value={this.state.email} placeholder="Email" required={true} onChange={this.onChangeEmail} />
                <input type="password" name="pass" value={this.state.password} placeholder="Password" required={true} onChange={this.onChangePassword} />
                <button className="signup-btn btn" form="authorization-form" onClick={this.signUp} >sign up</button>
                <button className="login-btn btn" form="authorization-form" onClick={this.login} >login</button>
            </form>
        </div>
    )

  }
}

export default AuthorizationPage;
