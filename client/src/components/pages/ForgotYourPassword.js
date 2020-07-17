// Component: ForgotYourPassword
// Description: This component sends the email to the user with the link
//                to reset their password. 

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class ForgotYourPassword extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            status: 400
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
            .patch(`http://localhost:5000/forgot-password`, { 'email': this.state.email })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const { email, status } = this.state
        return (
            <div>
            {( status === 200 ) ?
                <h4> You have been sent an email with directions to reset your password. </h4>
            :   <div>
                    <h1> Forgot Your Password</h1>
                    <p style={{ fontSize:"85%" }}> Please enter your work email to be emailed directions on how to reset your password. </p>
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
                        <button type="submit">Send </button>
                    </form>
                </div>}
            </div>
        )
    }
}

export default ForgotYourPassword;
