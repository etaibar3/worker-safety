// Component: Login
// Description: This component handles the front end login functionality. 

// TODO: 
//  --make formatting/styling compatible with rest of site
//  --add "forgot password" feature
//  --add "remember me" feature
import React from 'react';

function Login() {
	return (
		<div>
			<h1> Login</h1>
			<label> Work Email </label>
			<input type="email" placeholder="example@company.com" /><br></br><br></br>
			<label> Password </label>
			<input type="password" placeholder="Password" /><br></br><br></br>
			<input type="button" value="Login" />
		</div>
	)
}

export default Login;
