// Component: Login
// Description: This component handles the front end login functionality. 

// TODO: 
//  --make formatting/styling compatible with rest of site
//  --add "forgot password" feature
//  --add "remember me" feature
import React from 'react';
import axios from 'axios';

class Login extends React.Component {
	constructor() {
		super()
		this.state = {
			email: "",
			password: ""
		}
		this.handleChange=this.handleChange.bind(this)
		this.handleSubmit=this.handleSubmit.bind(this)
	}

	handleChange(event) {
		const { name, value } = event.target
		this.setState({
			[name]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		axios
			.post(`http://localhost:5000/login`, { 'email': this.state.email, 'password': this.state.password })
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				console.log(error)
			})			
	}

	render() {
		const { email, password } = this.state
		return (
			<div>
				<h1> Login</h1>
				<form onSubmit={this.handleSubmit}>
					<label> 
						Work Email 
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
						<input
							type="password"
							name="password"
							value={password}
							placeholder="Password"
							onChange={this.handleChange}
						/>
					</label>
						<br/><br/>
					<button type="submit">Login </button>
				</form>
			</div>
		)
	}
}

export default Login;
