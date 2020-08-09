import React, { useState }from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import { Redirect } from 'react-router';


class ReportACase extends React.Component {
	constructor() {
		super()
		this.state = {
			illDate: new Date(),
			testDate: new Date(),
			max: new Date(),
			earliest: new Date(),
			cancel: false,
			validDates: false,
			redirect: false
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.cancelReport = this.cancelReport.bind(this)
	}

	componentDidMount() {
		if (sessionStorage.getItem('loggedIn') === "false" ) {
			console.log("not logged in");
			this.setState({redirect: true});
		}
	}

    handleChange = async event => {
		const { illDate, testDate } = this.state
        const {name, value} = event.target
		this.setState({ [name]: value })
		const today = new Date()
		if (illDate <= today && testDate <= today) {
			this.setState({validDates: true})
		}
	}

	cancelReport() {
        this.setState({
        	cancel: true
        });
    }
    
    handleSubmit(event){
		const { illDate, testDate, validDates } = this.state
		event.preventDefault()
		if (illDate <= testDate) {
			this.setState({ earliest: illDate})
		}
		else {
			this.setState({ earliest: testDate})
		}

        {/* Post the case here and send email alerts */}
        axios
            .post(`http://localhost:5000/report`, { 'date': this.state.earliest })
            .then(response => {
				/* Response in data returns a message and emails, a list of user emails we sent alerts to*/
                console.log(response);
                alert(`case successfully reported for ${this.state.earliest}`)
            })
            .catch(error => {
				console.log(error)
				if(error.response !== undefined) {
					console.log(error.response.data.error)
					//this.props.alert.error(error.response.data.error)
				}
                alert(`error posting case on ${this.state.earliest}`)
                
            }) 


	}

	render() {
		const { email, illDate, max, testDate, cancel, validDates } = this.state
		const { redirect } = this.state;

		if (redirect) {
			return <Redirect to = {{ pathname: "/login" }} />
		}

		return (
			<div>
				{(cancel === true) ? <Redirect to = {{ pathname: "/root-menu" }} /> : null}
                <p className="h1"><strong> Report a Case </strong></p>
				<p className="font-rubik leading-normal text-text">If you have recently tested positive for COVID-19, please report your case below.</p> 
				<br />
				<form onSubmit={this.handleSubmit}>
              		<label className="h6">
	              		<strong> When did you first start feeling ill with COVID-19 symptoms? </strong>
	              		<br />
	              		<input
		                  className="rounded bg-primary-light border border-border max-w-xs"
		                  type="date"
		                  name="illDate"
		                  value={illDate}
		                  max={max}
		                  onChange={this.handleChange}
	              		/>
              		</label>
              		<br /><br />
              		<label className="h6">
	              		<strong> When did you test positive for COVID-19? </strong>
	              		<br />
	              		<input
		                  className="rounded bg-primary-light border border-border max-w-xs"
		                  type="date"
		                  name="testDate"
		                  value={testDate}
		                  max={max}
		                  onChange={this.handleChange}
	              		/>
              		</label>
              		<br /><br /><br /><br />
                    {(validDates) ?
                        <div>
                            <button style={cancelStyle} onClick={this.cancelReport}>Cancel</button>
                            {" "}
                            <button type="submit" style={submitButtonActive} onSubmit={this.handleSubmit}>Submit</button> 
                        </div>
                        :
                        <div>
                            <button style={cancelStyle} onClick={this.cancelReport}>Cancel</button>
                            {" "}
                            <button style={submitButtonInactive}>Submit</button>
                        </div>
                    } 
				</form>
			</div>
		)
	}
	}


const submitButtonActive = {
  width: 131,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#2121ca",
  color:"#ffffff"
};


const cancelStyle = {
  width: 113,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#ffffff",
  color: "#2121ca"
};

const submitButtonInactive = {
  width: 131,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#c4c4c4",
  color:"#ffffff"
};

export default ReportACase
