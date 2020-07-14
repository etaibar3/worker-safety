// Component: CreateRootAccount
// Description: This component handles the front end account creation for the root admin 
//              account. 

// TODO: 
//	--add functionality so that employees can lookup their company representative.
//  --make formatting/styling compatible with rest of site
//  --remove "Create Account" from Navbar and link to this page from "get started" page
//  --form validation (only allow form submission if adminChecked, min password length)
import React from 'react';
import axios from 'axios';

class CreateRootAccount extends React.Component {
	constructor() {
		super()
		this.state = {
			company: "",
			email: "",
			password: "",
			adminChecked: false /* must be true to submit form */,
			errorMessage: "",
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
			.post(`http://localhost:5000/admin/create-account`, { 'email': this.state.email, 'password': this.state.password, 'org': this.state.company })
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				console.log(error)
				this.setState({
                    status: error.response.status,
                    errorMessage: error.response.data.error
                })
			})			
	}

	render() {
		const { company, email, password, adminChecked } = this.state
		return (
		<div>
			{this.state.errorMessage &&
                <h3 className="error"> { this.state.errorMessage } </h3> }
			<h1> Create Root Account </h1>
			<p align="left"> By filling out this form, you are creating an administrative account within your organization.
			All other accounts for your organization should be created through this account or other administrative
			accounts by adding employees to the company roster. If you would like to be added
			to an organization's roster, please reach out to your company representative, and you will be emailed a 
			link to create your account.</p><br/>
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
						name= "password" 						
						value={password}
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
						I understand that I am creating the root account for my company
						and will be responsible for managing my company roster and floor plan. 
				</label> 
					<br/><br/>
				<button type="submit">Create Account</button>
			</form>
		</div>
		)
	}
}

export default CreateRootAccount;
