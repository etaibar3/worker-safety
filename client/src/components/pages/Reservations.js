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
            status: 400,
            reservations: []
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.handleMethodChange = this.handleMethodChange.bind(this)
        this.routeChange = this.routeChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        {/* Get reservations here */}
        axios
            .get(`http://localhost:5000/reservations`)
            .then(response => {
                console.log(response)
                const reservationsPop = 
                response.data.reservations.map((reservation, index) => {
                    const newReservation = {
                        deskNum: reservation.id,
                        date: reservation.date,
                    };
                    return newReservation
                })
                this.setState({
                  reservations: reservationsPop
                })
            })
            .catch(error => {
                console.log(error)
                console.log(error.response.data.error)
            })
      }

    handleChange(event) {
        const {name, value } = event.target
        this.setState({ [name] : value })
    }

    routeChange() {
      this.setState({ method: "Reserve"})
    }

    handleMethodChange(event) {
        this.setState(this.initialState)
        const { name, value } = event.target
        this.setState({ [name] : value })
    }

    handleSubmit(event) {
        event.preventDefault()
        {/*if (this.state.method === "CHANGE THIS") {
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
      */}
    }

    render() {
        const { method, reservations } = this.state
        return (
            <div>
                <p style={reservationsStyle}> Reservations </p>
                <button style={reserveBlue} onClick={this.routeChange}>Reserve</button> 
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
                     <table align="center" style={rectangle3}>
                          <thead>
                                <tr>
                                    <th> Date </th>
                                    <th> Desk Number </th>
                                </tr>
                          </thead>
                    </table>
                   {(reservations.length > 0) ?
                    <h1> THERE ARE RESERVATIONS TO DISPLAY </h1> : null }
            </div>
        )
    }
}

const reservationsStyle = {
  width: 231,
  height: 41,
  fontFamily: "Rubik",
  fontSize: 35,
  fontWeight: "bold",
  fontStyle: "normal",
  letterSpacing: 0,
  color: "#222831"
};

const reserveBlue = {
  width: 123,
  height: 49,
  borderRadius: 5,
  backgroundColor: "#2121ca",
  color:"#ffffff"
};

const rectangle3 = {
  width: 1080,
  height: 600,
  borderRadius: 5,
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#c4c4c4"
};

export default Reservations
