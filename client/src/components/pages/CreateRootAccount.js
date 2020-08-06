// Component: CreateRootAccount
// Description: This component handles the front end account creation for the root admin 
//              account. 

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { withAlert } from 'react-alert';

class CreateRootAccount extends React.Component {
	constructor() {
		super()
		this.state = {
			company: "",
			email: "",
			first: "",
			last: "",
			password1: "",
			password2: "",
			adminChecked: false, /* must be true to submit form */
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
		const { company, email, password1, password2, adminChecked, first, last } = this.state
		event.preventDefault()
    	{(password1 === password2 && adminChecked) ? 
			axios
				.post(`http://localhost:5000/admin/create-account`, { 'email': email, 'password': password1, 'org': company, 'firstName': first, 'lastName': last })
				.then(response => {
					console.log(response)
          this.props.alert.success('Success')
					this.setState({
						status: response.status
					})
				})
				.catch(error => {
					console.log(error)
					if(error.response !== undefined)  {
						this.props.alert.error(error.response.data.error)
					}
				})
			: alert(`This form cannot be submitted. Please make sure your passwords match and that you have checked the acknowledgement box at the bottom of the form, and try again.`)
            this.setState({
                password1: "",
                password2: ""
            })		
        }
	}

	render() {
		const { company, email, password1, password2, adminChecked, status, first, last } = this.state
		const pageTitle = {
		  width: 167,
		  height: 41,
		  fontFamily: "Rubik",
		  fontSize: 35,
		  fontWeight: "bold",
		  fontStyle: "normal",
		  letterSpacing: 0,
		};
		const buttonprimarylarge = {
		  width: 180,
		  height: 59,
		  borderRadius: 5,
		  backgroundColor: "#2121ca",
		  color: 'white'
		};
		const rectangle4 = {
		  width: 280,
		  height: 49,
		  borderRadius: 5,
		  backgroundColor: "#ffffff",
		  borderStyle: "solid",
		  borderWidth: 2,
		};
		return (
			<div>
				{(status === 200) ?
				<Redirect to = {{ pathname: "/login" }} /> 
				: 
				<div>
					<div style={pageTitle}> Create Account </div>
					<br /><br />
					<p> By filling out this form, you are creating an administrative account for your organization.
					Other administrators and employees can be added to your company roster through this account. If you are
					not a company representative and you would like to be added to an organization's roster, please reach out 
					to your company representative, and you will be emailed a 
					link to create your account.</p><br/>
					<form onSubmit={this.handleSubmit}>
						<label> 
							Company
							{" "}
							<input
								style = {rectangle4}
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
								style = {rectangle4}
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
								style = {rectangle4}
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
								style = {rectangle4}
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
								style = {rectangle4}
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
		                    	style = {rectangle4}
		                        type="password"
		                        name="password2"
		                        value={password2}
		                        placeholder="Password"
		                        onChange={this.handleChange}
		                    />
		                </label>
		                    <br/><br/>
						<label> 
							<input 
								type="checkbox" 
								name="adminChecked"
								checked={adminChecked}
								onChange={this.handleChange}
							/>
								{" "}I understand that I am creating the root account for my company
								and will be responsible for managing my company roster and floor plan. 
						</label> 
							<br/><br/>
						<button style={buttonprimarylarge} type="submit">Create Account</button>
					</form>
				<br/><br/><br/><br/><br/><br/><br/><br/> 
				</div>
			}
			</div>
		)
	}
}

export default withAlert()(CreateRootAccount);
