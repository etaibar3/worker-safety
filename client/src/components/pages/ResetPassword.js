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
            email: "",
            password: "",
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
    }

    render() {
        const { email, password, status } = this.state
        return (
            <div>
            {( status === 200 ) ?
                <Redirect to = {{ pathname: "/login" }} />
            :   <div>
                    <h1> Reset Password</h1>
                    <form onSubmit={this.handleSubmit}>
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
                        <button type="submit">Set Password </button>
                    </form>
                </div>}
            </div>
        )
    }
}

export default ResetPassword;
