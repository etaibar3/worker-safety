// Component: CreateChildAccount
// Description: This component handles the front end account creation for the all secondary admin and employee accounts 

// TODO: 
//  --make formatting/styling compatible with rest of site 
//  --fill in all caps fields with appropriate info 
import React from 'react';

class CreateChildAccount extends React.Component {
    constructor() {
        super()
        this.state = {
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
        //alert(`${this.state.email} ${this.state.password}`)
        event.preventDefault()
        // axios
        //  .post(`URL HERE`, { 'email': this.state.email, 'password': this.state.password, 'org': this.state.company })
        //  .then(response => {
        //      console.log(response)
        //  })
        //  .catch(error => {
        //      console.log(error)
        //  })          
    }

    render() {
        return (
            <div>
                <h1> Create Child Account </h1>
                <p align="left"> Your company representative, COMPANYREP@COMPANY.COM,
                 has added you as an EMPLOYEE/ADMIN at COMPANYNAME. Please create a password
                 to finish setting up your account. </p>
            <form onSubmit={this.handleSubmit}>
                <label> 
                    Work Email 
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
