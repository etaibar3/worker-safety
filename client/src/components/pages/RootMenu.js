// Component: RootMenu
// Description: This component is the page the admin sees
//              upon login.

import React from 'react'
import { Link } from "react-router-dom"

function RootMenu() {
	return (
		<div>
			<h3> Administrative Menu </h3>
			<Link to='/roster'> View Company Roster </Link>
			<br/><br/>
			<Link to='/floorplan'> View Floor Plan </Link>
		</div>
	)
}

export default RootMenu
