// Component: EmployeeMenu
// Description: This component is the page the employee sees
//              upon login.

import React from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'

class EmployeeMenu extends React.Component {
	state = {
		redirect: false
	}

	componentDidMount() {
		if (sessionStorage.getItem('loggedIn') === "false" ) {
			console.log("not logged in");
			this.setState({redirect: true});
		} 
	}

	render() {
		const { redirect } = this.state;

		if (redirect) {
			return <Redirect to = {{ pathname: "/login" }} />
		}
		
		return (
			<div>
				<h2> Employee Menu </h2>
				<Link to='/reservations'> Manage my Reservations </Link>
				<br/><br/>
				<Link to='/company-rep'> Contact my Company Representative </Link>
				<br/><br/>
				<Link to='/report-a-case'> Report a Case </Link>
			</div>
		)
	}
}

export default EmployeeMenu
