import React, { Component } from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { Link, Redirect } from 'react-router-dom';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL,  ACCESS_TOKEN } from '../../constants';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import Management from '../../pictures/Management.jpg';
import Alert from 'react-s-alert';

import { Form, Input, Button, Icon, notification } from 'antd';
const FormItem = Form.Item;

class Login extends Component {

    componentDidMount() {
        // If the OAuth2 login encounters an error, the user is redirected to the /login page with an error.
        // Here we display the error and then remove the error query parameter from the location.
        if(this.props.location.state && this.props.location.state.error) {
            setTimeout(() => {
                Alert.error(this.props.location.state.error, {
                    timeout: 5000
                });
                this.props.history.replace({
                    pathname: this.props.location.pathname,
                    state: {}
                });
            }, 100);
        }
    }
    render() {
        
        if(this.props.authenticated) {
            return <Redirect
                to={{
                pathname: "/",
                state: { from: this.props.location }
            }}/>;            
        }

        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div id="login-card" style={{display: 'flex', justifyCcontent: 'space-between'}}>
            <div id="landing-image" className='landing-image'>
                <img alt="logo" src={Management} width={window.innerWidth - 460} style={{borderRadius: '16px', boxSshadow: '0 4px 8px 0 rgba(0,0,0,0.2)'}} />
            </div>
            <div className="login-container" style={{float: 'right', width: '100%', marginTop: 'unset', backgroundColor: 'white', borderRadius: '16px'}}>
            <div style={{margin: '10px', marginTop: '20px'}}>
                <h1 className="page-title" style={{marginBottom: '10px'}}>Login</h1>
                <div className="login-content">
                    <SocialLogin />
                    <div className="or-separator">
                        <span className="or-text">OR</span>
                    </div>
                    <AntWrappedLoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
            </div>
            </div>
        );
    }
}

class SocialLogin extends Component {
    render() {
        return (
            <div className="social-login">
                <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                    <img src={googleLogo} alt="Google" /> Log in with Google</a>
                <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                    <img src={fbLogo} alt="Facebook" /> Log in with Facebook</a>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    this.props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {
                        notification.error({
                            message: 'Learn Opus',
                            description: 'Your Username or Password is incorrect. Please try again!'
                        });                    
                    } else {
                        notification.error({
                            message: 'Learn Opus',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });                                            
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem
                    label="User Name / Mail ID">
                    {getFieldDecorator('laUserNameOrLaMailId', {
                        rules: [{ required: true, message: 'Please input your username or email!' }],
                    })(
                    <Input 
                        prefix={<Icon type="user" />}
                        size="large"
                        name="laUserNameOrLaMailId" 
                        placeholder="Username or Email" />    
                    )}
                </FormItem>
                <FormItem
                label="Password">
                {getFieldDecorator('laPassword', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input 
                        prefix={<Icon type="lock" />}
                        size="large"
                        name="laPassword" 
                        type="password" 
                        placeholder="Password"  />                        
                )}
                </FormItem>
                <FormItem
                style={{marginTop: 16}}>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    Or <Link to="/signup">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}


export default Login;