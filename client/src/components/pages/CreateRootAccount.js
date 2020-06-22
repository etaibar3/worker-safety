// Component: CreateRootAccount
// Description: This component handles the front end account creation for the root admin account. 

// TODO: 
//	--add functionality so that employees can lookup their company representative.
//  --make formatting/styling compatible with rest of site
//  --remove "Create Account" from Navbar and link to this page from "get started" page 
import React from 'react';

function CreateRootAccount() {
	return (
		<div>
			<h1> Create Root Account </h1>
			<p align="left"> By filling out this form, you will be creating the root administrative
			account for your organization. If you would like to be added to an organization's
			 roster, please reach out to your company representative.</p><br></br>
			<form>
				<label> Company  </label>
				<input type="text" placeholder="Company" /><br></br><br></br>
				<label> Work Email </label>
				<input type="email" placeholder="example@company.com" /><br></br><br></br>
				<label> Password </label>
				<input type="password" placeholder="Password" /><br></br><br></br>
				<input type="checkbox" />
				<label> I understand that I am creating the root account for my company
				and will be responsible for managing my company roster and floor plan. </label> <br></br>
				<input type="button" value="Create Account" />
			</form>
		</div>
	)
}

export default CreateRootAccount;