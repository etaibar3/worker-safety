import React from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'


class AddUser extends React.Component {
	constructor() {
		super()
	 	this.state = {
	 		email: "",       //string--required for all methods
	 		method: " ",     //string--methods to modify roster: add, remove, lookup, change type
	 		isAdmin: false,  //bool--only used when adding a user or changing account types
	 		confirmRemove: false,   //bool--used to confirm action for remove method
	 		HTTPsuccess: false   //bool--used to display whether or not the request was successful
	 	}
	 	this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const {name, value, type, checked} = event.target
		type === "checkbox" ? this.setState ({ [name]: checked }) : this.setState({ [name] : value })
	}

	render() {
		const { email, method, isAdmin, confirmRemove } = this.state
		return (
			<form onSubmit={this.handleSubmit} value={method}>
				<label> 
					Employee email
					<input 
						type="email"
						name="email"
						value={email}
						placeholder="employee@company.com" 
						onChange={this.handleChange}
					/>
				</label>
				<br/><br/>
				<h5> Select User Account Type </h5><p style={{ fontSize: "75%"}}> If you
				choose to add {email} as an administrator, they will
				be able to perform administrative tasks such as modifying floor plans and updating the company roster.
				If you are unsure, do not add as an administrator and {email} will be added as a regular employee.
				</p>
				<label> 
					Add as administrator
					<input 
						type="checkbox"
						name="isAdmin"
						value="Administrator"
						checked={isAdmin}
						onChange={this.handleChange}
					/>
					<br/>
				</label>
			</form>	
		)
	}
}

export default AddUser