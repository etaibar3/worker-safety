// Component: Login
// Description: This component handles the front end login functionality. 

//Where should sign up here link to-->root or child acct creation

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from "react-router-dom";
import { withAlert } from 'react-alert';

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            status: 400,
            isAdmin: false
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        axios
            .post(`http://localhost:5000/login`, { 'email': this.state.email, 'password': this.state.password })
            .then(response => {
                (response.status !== 200) ? console.log(response.data.error) : console.log(response.data.message)
                axios.defaults.headers.common['auth'] = response.data.token
                console.log(response)
                this.setState({ 
                    status: response.status,
                    isAdmin: response.data.isAdmin
                })
                this.props.alert.success('Logged in')
            })
            .catch(error  => {
                console.log(error)
                if(error.response.data)  {
                    this.props.alert.error(error.response.data.error)
                }
            })   
    }

    render() {
        const { email, password, status, isAdmin } = this.state
        return (
            <div>
            {( status !== 200) ?
                <div>
                    <p className="h2"> Safe Return </p>
                    <p className="font-rubik leading-normal text-text-light"> Don't have an account? </p>
                    <Link to='/create-child-account' className="font-rubik font-medium text-blue-blue"> Sign up here </Link>
                    <br/><br/>
                    <form onSubmit={this.handleSubmit}>
                        <label className="text-style"> 
                            <strong> Email Address </strong>
                            <br/>
                            <input
                                style={inputBox}
                                type="email"
                                name="email"
                                value={email}
                                placeholder="Enter your email address"
                                onChange={this.handleChange}
                            />
                        </label>
                            <br/><br/>
                        <label className="text-style"> 
                            <strong> Password </strong>
                            <br/>
                            <input
                                style={inputBox}
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Enter your password"
                                onChange={this.handleChange}
                            />
                        </label>
                        <br/>
                        <Link to='/forgotyourpassword' className="font-rubik font-medium text-#2121ca"> Forgot your password? </Link>
                        <br/><br/>
                        <button style={submit} type="submit">Login </button>
                    </form>
            </div> : null}

            {( status === 200 && isAdmin) ?
                <Redirect to = {{ pathname: "/root-menu" }} /> : null }
            {( status === 200 && isAdmin === false) ?
                <Redirect to = {{ pathname: "/employee-menu" }} /> : null}
            </div>
        )
    }
}

const safeReturn = {
  width: 210,
  height: 34.2,
  fontFamily: "Rubik",
  fontSize: 35,
  fontWeight: "bold",
  fontStyle: "normal",
  letterSpacing: 0,
  color: "#222831"
};
const logo = {
  width: 54,
  height: 45,
  backgroundColor: "#c4c4c4"
};
const inputLabel = {
  width: 109,
  height: 19,
  fontFamily: "Rubik",
  fontSize: 20,
  fontWeight: "900",
  fontStyle: "normal",
  letterSpacing: 0,
  color: "#222831"
};
const submit = {
  width: 280,
  height: 59,
  borderRadius: 5,
  backgroundColor: "#2121ca",
  color: "#ffffff"
};
const inputBox = {
  width: 280,
  height: 59,
  borderRadius: 5,
  backgroundColor: "#ffffff",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#c4c4c4"
};
const SignUpForgotPass = {
  width: 177,
  height: 19,
  fontFamily: "Rubik",
  fontSize: 16,
  fontWeight: "1000",
  fontStyle: "normal",
  letterSpacing: 0,
  color: "#2121ca"
};
const dontHaveAnAccount = {
  width: 176,
  height: 24,
  fontFamily: "Rubik",
  fontSize: 16,
  fontWeight: "normal",
  fontStyle: "normal",
  lineHeight: 5,
  letterSpacing: 0,
  color: "#6c6c6c"
};

export default withAlert()(Login);
