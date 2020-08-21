// Component: ResetPassword
// Description: This component handles the password reset functionality,
//              and is where the emailed link redirects users. 

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class ResetPassword extends React.Component {
    constructor() {
        super()
        this.state = {
            password1: null,
            password2: null,
            status: 400,
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
        const { password1, password2, status } = this.state
        {(password1 === password2) ? 
            axios
                .patch(`/forgot-password/reset`, { 'resetToken': this.props.match.params.token, 'newPass': password1 })
                .then(response => {
                    console.log(response)
                    this.setState({ 
                        status: response.status,
                    })
                })
                .catch(error => {
                    console.log(error)
                }) 
            : alert(`Passwords do not match. Please try again.`)
            this.setState({
                password1: "",
                password2: ""
            })
        }
    }

    render() {
        const { password1, password2, status } = this.state
        return (
            <div>
            {( status === 200 ) ?
                <Redirect to = {{ pathname: "/login" }} />
            :   <div>
                    <h1> Reset Password</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label> 
                            Password (min. 6 characters)
                            {" "} 
                            <input
                                type="password"
                                name="password1"
                                style={inputBox}
                                value={password1}
                                placeholder="Password"
                                onChange={this.handleChange}
                            />
                        </label>
                            <br/><br/>
                        <label> 
                            Confirm Password
                            {" "} 
                            <input
                                type="password"
                                name="password2"
                                style={inputBox}
                                value={password2}
                                placeholder="Password"
                                onChange={this.handleChange}
                            />
                        </label>
                            <br/><br/>
                        <button type="submit">Set Password </button>
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

export default ResetPassword;
