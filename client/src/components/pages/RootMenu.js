// Component: RootMenu
// Description: This component is the page the admin sees
//              upon login.

import React from 'react'
import { Link } from "react-router-dom"

function RootMenu() {
	return (
		<div>
			<h2> Administrative Menu </h2>
			<Link to='/roster'> View Company Roster </Link>
			<br/><br/>
			<Link to='/floorplan'> View Floor Plan </Link>
			<br/><br/>
			<Link to='/reservations'> Manage my Reservations </Link>
			<br/><br/>
			<Link to='/report-a-case'> Report a Case </Link>
		</div>
	)
}

export default RootMenu
