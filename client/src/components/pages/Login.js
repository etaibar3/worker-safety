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
            .post(`/routes/login`, { 'email': this.state.email, 'password': this.state.password },
            //.post(`/api/login`, { 'email': this.state.email, 'password': this.state.password },
                {
                withCredentials: false, //RESET THIS TO TRUE
                })
            .then(response => {
                //axios.defaults.headers.common['auth'] = response.data.token
                console.log(response)
                this.setState({ 
                    status: response.status,
                    isAdmin: response.data.isAdmin
                })
                this.props.alert.success('Logged in')
            })
            .catch(error  => {
                console.log(error)
                if(error.response.data !== undefined)  {
                    this.props.alert.error(error.response.data.error)
                }
            }) 
    }
    
    componentDidUpdate() {
        if (this.state.status === 200) {
            sessionStorage.setItem('loggedIn', true);
            console.log(sessionStorage.getItem('loggedIn'));
        } else {
            sessionStorage.setItem('loggedIn', false);
            console.log(sessionStorage.getItem('loggedIn'));
        }
    }


    render() {
        const { email, password, status, isAdmin } = this.state
        return (
            <div>
            {( status !== 200) ?
                <div>
                    <p className="h2"> Safe Return </p>
                    <p style={lightFont}> Don't have an account? </p>
                    <Link to='/create-child-account' style={hyperlink}> Sign up here </Link>
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
                        <Link to='/forgotyourpassword' style={hyperlink}> Forgot your password? </Link>
                        <br/><br/>
                        {(email !== "" & password != "") ?
                          <button style={submitActive} type="submit">Login </button>
                          : 
                          <button style={submitInactive} type="button">Login </button>}
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
const lightFont = {
  color: "#6C6C6C"
}

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
const submitActive = {
  width: 280,
  height: 59,
  borderRadius: 5,
  backgroundColor: "#2121ca",
  color: "#ffffff"
};
const submitInactive = {
  width: 280,
  height: 59,
  borderRadius: 5,
  backgroundColor: "#c4c4c4",
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
const hyperlink = {
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
