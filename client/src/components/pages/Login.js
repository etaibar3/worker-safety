// Component: Login
// Description: This component handles the front end login functionality. 

// TODO: 
//  --add "forgot password" feature
//  --add "remember me" feature
//  --token handling so that logged in bool is traced throughout pages
import React from 'react';

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
		//API fetch for authentications
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
