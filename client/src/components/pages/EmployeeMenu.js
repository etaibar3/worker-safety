// Component: EmployeeMenu
// Description: This component is the page the employee sees
//              upon login.

import React from 'react'
import { Link } from "react-router-dom"

function EmployeeMenu() {
	return (
		<div>
			<h2> Employee Menu </h2>
			<Link to='/reservations'> Manage my Reservations </Link>
			<br/><br/>
			<Link to='/company-rep'> Lookup my Company Representative </Link>
			<br/><br/>
			<Link to='/report-a-case'> Report a Case </Link>
		</div>
	)
}

export default EmployeeMenu
