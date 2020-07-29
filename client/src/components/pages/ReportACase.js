import React, { useState }from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'


class ReportACase extends React.Component {
	constructor() {
		super()
		this.state = {
			email: "",
			illDate: new Date(),
			max: new Date()
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSelect = this.handleSelect.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
        const {name, value} = event.target
		this.setState({ [name]: value })
	}

	handleSelect(date) {
		this.setState({ illDate: date})
	}

	handleSubmit(event) {
		event.preventDefault()
		alert(`${this.state.illDate}`)
	}

	render() {
		const { email, illDate, max } = this.state
		return (
			<div>
				<h1> Report a Case </h1>
				<p> If you are feeling unwell or have recently tested positive for COVID-19, please follow proper
				social distancing guidelines and avoid non-essential travel and social contact. {" "}  
				<strong>Please fill out this form if you have recently tested positive for COVID-19, and your 
				case will be reported.</strong></p> 
				<br />
				<form onSubmit={this.handleSubmit}>
					<p> Whose case are you reporting? </p>
					<p style={{ fontSize:"70%" }}> If you are reporting your own case, please enter your email associated
						with your Safe Return account. If you are reporting a case for another
						employee, please enter that employee's email address. 
					</p>
                    <label> 
                        Work Email
                        {" "} 
                        <input
                            type="email"
                            name="email"
                            value={email}
                            placeholder="example@company.com"
                            onChange={this.handleChange}
                        />
                    </label>
                        <br/><br/>
					<p> When did you (or the employee you are reporting for) first start feeling ill before testing positive for COVID-19? </p>
					<DatePicker
						selected={illDate}
						onChange={this.handleSelect}
						maxDate={max}
					/>
					<br /><br /><br /><br />
					<button type="submit">Submit</button>
					<br /><br /><br /><br /><br /><br /><br /><br />
				</form>
			</div>
		)
	}
}

export default ReportACase
