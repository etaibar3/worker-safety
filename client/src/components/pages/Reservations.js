// Component: Reservations
// Description: This is the reservations page where employees can view, cancel,
//      and make reservations

import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';


class Reservations extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            method: " ",
            status: 400
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.handleMethodChange = this.handleMethodChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const {name, value } = event.target
        this.setState({ [name] : value })
    }

    handleMethodChange(event) {
        this.setState(this.initialState)
        const { name, value } = event.target
        this.setState({ [name] : value })
    }

    handleSubmit(event) {
        event.preventDefault()
        if (this.state.method === "Add") {
            axios
                .post(`http://localhost:5000/org/manageRoster`, { 'email': this.state.email, 'admin': this.state.isAdmin})
                .then(response => {
                    console.log(response)
                    this.props.alert.success('Success')
                })
                .catch(error => {
                    console.log(error)
                    this.props.alert.error(error.response.data.error)
                })
        }
    }

    render() {
        const { method } = this.state
        return (
            <div>
                <h1> Manage My Reservations </h1>
                    <p> What would you like to do? </p>
                    <form onSubmit={this.handleSubmit} value={method}>
                        <select name="method" onChange={this.handleMethodChange}>
                            <option value=" "> </option>
                            <option value="Reserve">Reserve a desk</option>
                            <option value="Cancel">Cancel a reservation</option>
                            <option value="View">View my reservations</option>
                        </select>
                        {(method === "Reserve") ? <Redirect to = {{ pathname: "/reserve-date" }} /> : null}
                     </form>
            </div>
        )
    }
}

export default Reservations
