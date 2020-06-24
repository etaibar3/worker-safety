// Component: CreateChildAccount
// Description: This component handles the front end account creation for the all secondary admin and employee accounts 

// TODO: 
//  --make formatting/styling compatible with rest of site 
//  --fill in all caps fields with appropriate info 
import React from 'react';

function CreateChildAccount() {
	return (
		<div>
			<h1> Create Child Account </h1>
			<p align="left"> Your company representative, COMPANYREP@COMPANY.COM,
			 has added you as an EMPLOYEE/ADMIN at COMPANYNAME. Please create a password
			 to finish setting up your account. </p>
			<form>
				<label> Password </label>
				<input type="password" placeholder="Password" /><br></br><br></br>
				<input type="button" value="Create Account" />
			</form>
		</div>
	)
}

export default CreateChildAccount;
