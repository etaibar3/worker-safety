// Component: ForgotYourPassword
// Description: This component sends the email to the user with the link
//                to reset their password. 

import React from 'react';
import axios from 'axios';

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
            .patch(`/forgot-password`, { 'email': this.state.email })
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
                    <h2> Reset password</h2>
                    <br />
                    <p> Please enter the email associated with your account, and we'll send you a link to reset your password! </p>
                    <br />
                    <form onSubmit={this.handleSubmit}>
                        <label className="text-style"> 
                            <strong> Email </strong>
                            <br/>
                            <input
                                type="email"
                                name="email"
                                style={inputBox}
                                value={email}
                                placeholder="Enter your email address"
                                onChange={this.handleChange}
                            />
                        </label>
                            <br/><br/>
                        {(email.length > 0) ?
                          <button style={submitActive} type="submit">Send Link </button>
                          : 
                          <button style={submitInactive} type="button">Send Link </button>}
                    </form>
                </div>}
            </div>
        )
    }
}


const inputBox = {
  width: 230,
  height: 50,
  padding: 8,
  borderRadius: 5,
  backgroundColor: "#ffffff",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#c4c4c4"
};

const submitActive = {
  width: 200,
  height: 59,
  borderRadius: 5,
  backgroundColor: "#2121ca",
  color: "#ffffff"
};

const submitInactive = {
  width: 200,
  height: 59,
  borderRadius: 5,
  backgroundColor: "#c4c4c4",
  color: "#ffffff"
};

export default ForgotYourPassword;
