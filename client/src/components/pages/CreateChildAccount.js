// Component: CreateChildAccount
// Description: This component handles the front end account creation for the all secondary admin and employee accounts 

import React from 'react';
import axios from 'axios'
import { Redirect } from 'react-router';
import { withAlert } from 'react-alert';

class CreateChildAccount extends React.Component {
    constructor() {
        super()
        this.state = {
            company: "",
            email: "",
            password1: "",
            password2: "",
            first: "",
            last: "",
            status: 400
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }


    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState ({ [name]: checked }) : this.setState({ [name] : value })
    }   

    handleSubmit(event) {
        const { company, email, password1, password2, status, first, last } = this.state
        event.preventDefault()
        const alert = this.props.alert;
        {(password1 === password2) ? 
            axios
                .post(`http://localhost:5000/employee/create-account`, { 'email': email, 'password': password1, 'org': company, 'firstName': first, 'lastName': last })
                .then(response => {
                    console.log(response)
                    this.props.alert.success('Success')
                    this.setState({ status: response.status})
                })
                .catch(error => {
                    console.log(error)
                    if(error.response !== undefined)  {
                        this.props.alert.error(error.response.data.error)
                    }
                })
            : alert(`Passwords do not match. Please try again.`)
            this.setState({
                password1: "",
                password2: ""
            })
        }
    }

   
    render() {
        const { company, email, password1, password2, status, first, last } = this.state
        return (
            <div>
                {(status === 200) ?
                    <Redirect to = {{ pathname: "/login" }} /> 
                    : <div>
                        <h1> Create Employee Account </h1>
                        <p align="center"> Please fill out the form to finish setting up your account. </p>
                        <form onSubmit={this.handleSubmit}>
                            <label> 
                                Company
                                {" "}
                                <input 
                                    type="text"
                                    value={company}
                                    name="company" 
                                    placeholder="Company" 
                                    onChange={this.handleChange}
                                />   
                            </label>
                                <br/><br/>
                        <label> 
                            First name
                            {" "}
                            <input 
                                type="text"
                                value={first}
                                name="first" 
                                placeholder="First" 
                                onChange={this.handleChange}
                            />   
                        </label>
                            <br/><br/>
                        <label> 
                            Last name
                            {" "}
                            <input 
                                type="text"
                                value={last}
                                name="last" 
                                placeholder="Last" 
                                onChange={this.handleChange}
                            />   
                        </label>
                            <br/><br/>
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
                                Password (min. 6 characters)
                                {" "} 
                                <input
                                    type="password"
                                    name="password1"
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
                                    value={password2}
                                    placeholder="Password"
                                    onChange={this.handleChange}
                                />
                            </label>
                                <br/><br/>
                            <button type="submit">Create Account</button>
                        </form>
                    </div>
                    }
            </div>
        )
    }
}

export default withAlert()(CreateChildAccount);
