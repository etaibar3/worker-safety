// Component: RootMenu
// Description: This component is the page the admin sees
//              upon login.

import React from 'react'
import { Link } from "react-router-dom"
import { Redirect } from 'react-router'
import AdminNavBar from "../layout/AdminNavBar"

class RootMenu extends React.Component {
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
                <br />
                <AdminNavBar />
                <br /><br />
				<h2> Administrative Menu </h2>
				<Link to='/roster'> View Company Roster </Link>
				<br/><br/>
				<Link to='/upload-floor-plan'> View Floor Plan </Link>
				<br/><br/>
				<Link to='/reservations'> Manage my Reservations </Link>
				<br/><br/>
				<Link to='/report-a-case'> Report a Case </Link>
			</div>
		)
	}
}

export default RootMenu
