// Component: CreateChildAccount
// Description: This component handles the front end account creation for the all secondary admin and employee accounts 

// TODO: 
//  --make formatting/styling compatible with rest of site 
//  --fill in all caps fields with appropriate info 
import React from 'react';
import axios from 'axios'

class CreateChildAccount extends React.Component {
    constructor() {
        super()
        this.state = {
            company: "",
            email: "",
            password: "",
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState ({ [name]: checked }) : this.setState({ [name] : value })
    }   

    handleSubmit(event) {
        event.preventDefault()
        axios
         .post(`http://localhost:5000/employee/create-account`, { 'email': this.state.email, 'password': this.state.password, 'org': this.state.company })
         .then(response => {
             console.log(response)
             {/*401 means theyre not invited by an admin OR they are an admin so must create THROUGH CREATE ROOT ACCT*/}
         })
         .catch(error => {
             console.log(error)
         })          
    }

    render() {
        return (
            <div>
                <h1> Create Employee Account </h1>
                <p align="center"> Please fill out the form to finish setting up your account. </p>
            <form onSubmit={this.handleSubmit}>
                <label> 
                    Company
                    {" "}
                    <input 
                        type="text"
                        value={this.state.company}
                        name="company" 
                        placeholder="Company" 
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
                        value={this.state.email}
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
                        name= "password"                        
                        value={this.state.password}
                        placeholder="Password"
                        onChange={this.handleChange}
                    />
                </label>
                    <br/><br/>
                <button type="submit">Create Account</button>
            </form>
            </div>
        )
    }
}

export default CreateChildAccount;
