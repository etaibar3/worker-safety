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
			testDate: null,
			illDate: null,
			resultDate: null
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
        const {name, value} = event.target
		this.setState({ [name]: value })
	}

	handleSelect(event) {
        const {name, value} = event.target
		this.setState({ [name]: value })
	}

	handleSubmit(event) {
		event.preventDefault()
		alert(`reporting case`)
	}

	render() {
		const { email, testDate, illDate, resultDate} = this.state
		return (
			<div>
				<h1> Report a Case </h1>
				<p> If you are feeling unwell or have recently tested positive for COVID-19, please follow proper
				social distancing guidelines and avoid non-essential travel and social contact. {" "}  
				<strong>Please fill out this form if you have recently tested positive for COVID-19, and your 
				case will be reported.</strong></p> 
				<br />
				<form onSubmit={this.handleSubmit}>
					<p> When did you first start feeling ill before you tested positive for COVID-19? </p>
					<DatePicker
						onSelect={this.handleSelect}
					/>
					<br /><br />
					<p> When did you take your COVID-19 test? </p>
					<DatePicker
						selected={testDate}
						onChange={this.handleChange}
						onSelect={this.handleSelect}
						closeOnScroll={true}
						name="testDate"
					/>
					<br /><br />
					<p> When did you receive your positive test result for COVID-19? </p>
					<DatePicker
						selected={resultDate}
						onChange={this.handleChange}
						onSelect={this.handleSelect}
						closeOnScroll={true}
						name="resultDate"
					/>
					<br /><br /><br />
					<button type="submit">Submit</button>
				</form>
			</div>
		)
	}
}

export default ReportACase
