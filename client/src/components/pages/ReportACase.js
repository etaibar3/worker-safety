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
			testDate: new Date(),
			max: new Date(),
			earliest: new Date()
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSelectIll = this.handleSelectIll.bind(this)
		this.handleSelectTest = this.handleSelectTest.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
        const {name, value} = event.target
		this.setState({ [name]: value })
	}

	handleSelectIll(date) {
		this.setState({ 
			illDate: date,
		})
	}

	handleSelectTest(date) {
		this.setState({ 
			testDate: date,
		})
	}

	handleSubmit(event) {
		const { email, illDate, testDate } = this.state
		event.preventDefault()
		if (illDate <= testDate) {
			this.setState({ earliest: illDate})
		}
		else {
			this.setState({ earliest: testDate})
		}

		alert(`The earlier of the two dates is: ${this.state.earliest}`)
	}

	render() {
		const { email, illDate, max, testDate } = this.state
		return (
			<div>
				<h1> Report a Case </h1>
				<p> If you are feeling unwell or have recently tested positive for COVID-19, please follow proper
				social distancing guidelines and avoid non-essential travel and social contact. {" "}  
				<strong>Please fill out this form if you have recently tested positive for COVID-19, and your 
				case will be reported.</strong></p> 
				<br />
				<form onSubmit={this.handleSubmit}>
					<p> When did you first start feeling ill with COVID-19 symptoms? </p>
					<DatePicker
						selected={illDate}
						onChange={this.handleSelectIll}
						maxDate={max}
					/>
					<p> When did you test positive for COVID-19? </p>
					<DatePicker
						selected={testDate}
						onChange={this.handleSelectTest}
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
