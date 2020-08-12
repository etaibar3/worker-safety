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
                        <h4 style = {textStyle}> <strong> Welcome to Safe Return! </strong> </h4>
                        <h2 style = {textStyle}> Create your account </h2>
                        <br />
                        <p style = {textLtStyle}> To complete your registration, please fill out the form below.</p>
                        <br/><br/>
                        <form onSubmit={this.handleSubmit}>
                        <label className="text-style"> 
                            <strong> Company Name </strong><br/>
                            <input
                                style={inputBox}
                                type="text"
                                value={company}
                                name="company" 
                                placeholder="Enter your company's name" 
                                onChange={this.handleChange}
                            />   
                        </label>
                            <br/><br/>
                        <label className="text-style"> 
                            <strong> First name </strong><br/>
                            <input
                                style={inputBox}
                                type="text"
                                value={first}
                                name="first" 
                                placeholder="Enter your first name" 
                                onChange={this.handleChange}
                            />   
                        </label>
                            <br/><br/>
                        <label className="text-style"> 
                            <strong> Last name </strong><br/>
                            <input
                                style={inputBox}
                                value={last}
                                name="last" 
                                placeholder="Enter your last name" 
                                onChange={this.handleChange}
                            />   
                        </label>
                            <br/><br/>
                        <label className="text-style"> 
                            <strong> Email Address</strong><br/>
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
                            <strong> Password (min. 6 characters) </strong><br/>
                            <input
                                style={inputBox}
                                type="password"
                                name="password1"
                                value={password1}
                                placeholder="Enter a password"
                                onChange={this.handleChange}
                            />
                        </label>
                            <br/><br/>
                        <label className="text-style"> 
                            <strong> Re-enter Password </strong><br/>
                            <input
                                style={inputBox}
                                type="password"
                                name="password2"
                                value={password2}
                                placeholder="Re-enter password"
                                onChange={this.handleChange}
                            />
                        </label>
                        <br/><br/>
                        {(company != "" && email.length >=3 && password1.length > 5 && password1 === password2 && first !== "" && last !== "")
                        ?
                        <button style={submitActive} type="submit">Create Account</button>
                        :
                        <button style={submitInactive} type="button">Create Account</button>
                        }
                        </form>
                    </div>
                    }
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

const submitInactive = {
  width: 160,
  height: 59,
  borderRadius: 5,
  backgroundColor: "#c4c4c4",
  color: "#ffffff"
};

const submitActive = {
  width: 160,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#2121ca",
  color:"#ffffff"
};

const textStyle = {
    color: "#222831",
    textAlign: "left"
};

const textLtStyle = {
    color: "#6C6C6C",
    textAlign: "left"
};

export default withAlert()(CreateChildAccount);
