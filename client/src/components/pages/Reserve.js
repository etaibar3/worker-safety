// Component: Reserve
// Description: Component for employees to reserve a desk

import React from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'


class Reserve extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            status: 400,
            date: "",
            min: new Date(),
            showDesks: false,
            desk: null
        }
        this.handleSelect = this.handleSelect.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        {/*axios call for floorplan image from database with desk numbers*/}
    }

    handleSelect(date) {
        this.setState({ 
            date: date,
            showDesks: true
        })
    }

    handleChange(event) {
        const {name, value } = event.target
        this.setState({ [name] : value })
    }

    handleSubmit(event) {
        event.preventDefault()
        alert(`reserving desk number ${this.state.desk}`)
    }

    render() {
    	const { email, desk, status, date, min, showDesks } = this.state
    	return (
    		<div>
                <form onSubmit={this.handleSubmit}>
                    <p> When would you like to go into the office? </p>
                    <DatePicker
                        selected={date}
                        onChange={this.handleSelect}
                        minDate={min}
                    />
                    <br /><br />
                    {(showDesks) ? <div><h1> display available desks here</h1>
                        <label>
                            Desk number
                            {" "}
                            <input 
                                type="text"
                                name="desk"
                                value={desk}
                                onChange={this.handleChange}
                            />
                        </label> </div>
                    : null}
                    <br/><br/>
                    <button type="submit">Submit</button>
                </form>
	        </div>
    	)
    }
}

export default Reserve
