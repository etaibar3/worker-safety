// Component: Reserve
// Description: Component for employees to reserve a desk

//TODO: allow employees to make recurring reservations (select multiple dates at once)

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
            desk: null,
            maxDesk: 0
        }
        this.initialState = this.state
        this.handleSelect = this.handleSelect.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        {/*axios call for floorplan image from database with desk numbers and max desk num*/}
    
        { /*GET MAX DESKS 
            axios
             .get('http://localhost:5000/org/manageRoster/' + this.state.email)
             .then(response => {
                console.log(response)
                this.setState({
                    maxDesk: response.maxDesk,
                })
             })      */}
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
    {/* make sure desk num is valid integer */}
        alert(`reserving desk ${this.state.desk} on ${this.state.date} for EMAIL`)
        axios
                .post(`URL HERE`, { 'date': this.state.date, 'deskNum': this.state.desk }) 
                .then(response => {
                    console.log(response)
                    this.props.alert.success('Success')
                })
                .catch(error => {
                    console.log(error)
                    //this.props.alert.error(error.response.data.error)
                })
    }

    render() {
        const { email, desk, status, date, min, showDesks, maxDesk } = this.state
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
                    {(showDesks) ?
                        <div>
                        <h1> display floorplan with desk numbers here</h1> 
                        <h1> display available desks here</h1> 
                        <label>
                            Please enter the number of the desk you would like to reserve:
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
