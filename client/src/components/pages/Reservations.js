// Component: Reservations
// Description: This is the reservations page where employees can view, cancel,
//		and make reservations

import React from 'react'
import axios from 'axios'


class Reservations extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            method: " ",
            status: 400
        }
    }


    render() {
    	const { method } = this.state
    	return (
    		<div>
	    		<h1> Manage My Reservations </h1>
	                <p> What would you like to do? </p>
	                <form onSubmit={this.handleSubmit} value={method}>
	                    <select name="method">
	                        <option value=" "> </option>
	                        <option value="Reserve">Reserve a desk</option>
	                        <option value="Cancel">Cancel a reservation</option>
	                        <option value="View">View my reservations</option>
	                        <option value="Change">Modify an existing reservation</option>
	                    </select>
	                 </form>
	        </div>
    	)
    }
}

export default Reservations

