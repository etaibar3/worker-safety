// Component: Login
// Description: This component handles the front end login functionality. 

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from "react-router-dom"

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            status: 400,
            forgotPass: false,
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
                axios.defaults.headers.common['auth'] = response.data.token
                console.log(response)
                this.setState({ 
                    status: response.status,
                    isAdmin: response.data.isAdmin
                })
            })
            .catch(error => {
                console.log(error)
            })          
    }

    render() {
        const { email, password, status, forgotPass } = this.state
        return (
            <div>
            {( status === 200 ) ?
                <Redirect to = {{ pathname: "/root-menu" }} />
            :   <div>
                    <h1> Login</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label> 
                            Work Email
                            {" "} 
                            <input
                                type="email"
                                name="email"
                                value={email}
                                placeholder="example@company.com"
                                onChange={this.handleChange}
                            />
                        </label>
                            <br/><br/>
                        <label> 
                            Password
                            {" "} 
                            <input
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Password"
                                onChange={this.handleChange}
                            />
                        </label>
                            <br/><br/>
                        <button type="submit">Login </button>
                    </form>
                </div>}
            <Link to='/forgotyourpassword' style={{ fontSize:"65%" }}> Forgot your password? </Link>
            </div>
        )
    }
}

export default Login;
