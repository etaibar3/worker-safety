// Component: Roster
// Description: This component contains roster interactions.

// TODO:
//	--search company roster (with tags? filter?)
//	--add to roster (make sure employee is nonexistent and that an email was inputted)
// 	--don't accept form submission unless confirm==true
//  --lookup and change type methods--also consider what happens when no method is selected
//  --all admins rosters need to be synched up
//  --when employee is added it needs to show up in all admin's roster
//  --more specific error messages (make http success string instead of bool?)
//	--remove from roster
//		->does this delete child account or detach from parent?
//		->are future reservations for child account canceled? delete acct from db?

import React from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'


class Roster extends React.Component {
	constructor() {
		super()
	 	this.state = {
	 		email: "",       //string--required for all methods
	 		method: " ",     //string--methods to modify roster: add, remove, lookup, change type
	 		isAdmin: false,  //bool--only used when adding a user or changing account types
	 		confirmRemove: false,   //bool--used to confirm action for remove method
	 	}
	 	this.handleChange = this.handleChange.bind(this)
	 	this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
		const {name, value, type, checked} = event.target
		type === "checkbox" ? this.setState ({ [name]: checked }) : this.setState({ [name] : value })
	}

	handleSubmit(event) {
		event.preventDefault()
		alert(`${this.state.email} ${this.state.method} ${this.state.isAdmin} ${this.state.confirmRemove}`)
		if (this.state.method === "Add") {
			axios
				.post(`http://localhost:5000/org/manageRoster`, { 'email': this.state.email, 'admin': this.state.isAdmin})
				.then(response => {
					console.log(response)
					alert('${this.state.email} has been invited to your roster') 
				})
				.catch(error => {
					console.log(error)
				})
		}
		else if (this.state.method === "Remove") {
			axios
				.delete(`http://localhost:5000/org/manageRoster`, {data: {email: this.state.email } })
				.then(response => {
					console.log(response)
				})
				.catch(error => {
					console.log(error)
				})
		}
		else if (this.state.method === "Lookup") {
			// axios
			// 	.get('/user', {
			// 		params: {
			// 			ID: 12345
			// 		}
			// 	})
			// 	.then(response => {
			// 		console.log(response)
			// 	})
			// 	.catch(error => {
			// 		console.log(error)
			// 	})
		}
		else if (this.state.method === "Change type") {
			// axios
			// 	.patch('URL/IDNUMBER', 'isAdmin': this.state.isAdmin)
			// 	.then(response => {
			// 		console.log(response)
			// 	})
			// 	.catch(error => {
			// 		console.log(error)
			// 	})
		}
		else {
			alert('Error: No roster action selected.')
		}
	}

	render() {
		const { email, method, isAdmin, confirmRemove } = this.state
		return (
			<div>
				<h1> Company Roster </h1>
				<p> What would you like to do? </p>
				<form onSubmit={this.handleSubmit} value={method}>
					<select name="method" onChange={this.handleChange}>
						<option value=" "> </option>
						<option value="Add">Add a user</option>
						<option value="Remove">Remove a user</option>
						<option value="Lookup">Lookup a user</option>
						<option value="Change type">Change user account type</option>
					</select>
					<br/><br/>

					{/* All roster methods require a user email */}
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

					{/* To add a user, admin must choose user's account permissions (employee vs admin) */}
					{(method === "Add") ?
						<div>
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
						</div>
					: null}

					{/*To remove a user, admin must confirm that they want to remove this user*/}
					{(method === "Remove") ?
						<div>
							<p style={{ fontSize: "75%"}}> 
								I confirm that I would like to remove {email} from my company roster and understand 
								that this will prevent them from making future workspace reservations at my company.					
							</p>
							<label>
								Confirm
								<input 
									type="checkbox"
									name="confirmRemove"
									value="confirmRemove"
									checked={confirmRemove}
									onChange={this.handleChange}
								/>
						</label>
						</div>
					: null}

					{/*To change account type, admin will see what user's current account type is, and then can change it*/}
					
					<br/>
					<button type="submit">Submit</button>
				</form>
				<br/>
			</div>
		)
	}
}

export default Roster
