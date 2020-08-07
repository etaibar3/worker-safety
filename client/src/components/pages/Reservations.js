// Component: Reservations
// Description: This is the reservations page where employees can view, cancel,
//      and make reservations

import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';
import { withAlert } from 'react-alert';


class Reservations extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            method: " ",
            status: 400,
            userReservations: []
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.handleMethodChange = this.handleMethodChange.bind(this)
        this.routeChange = this.routeChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        {/* Get reservations here */}
        /*axios
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
            })*/
        const { userReservations } = this.state
        //const formatter = new Intl.DateTimeFormat('en', { month: 'short' });
        axios
            .get(`http://localhost:5000/reservations`)
            .then(response => {
                console.log(response)
                response.data.reservations.map((reservation, index) => {
                    const newReservation = {
                        deskNum: reservation.id,
                        day: reservation.date.day.low,
                        month: reservation.date.month.low,
                        //month: formatter.format(new Date(reservation.date.month.low)),
                        year: reservation.date.year.low
                    };
                    userReservations.push(newReservation)
                })
                this.setState({
                  userReservations: this.state.userReservations
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
        const { method, userReservations } = this.state
        return (
            <div>
                <p className="h1"><strong> Reservations </strong></p>
                <button style={reserveBlue} onClick={this.routeChange}>Reserve</button> 
                    <p className="font-rubik leading-normal text-text"> What would you like to do? </p>
                    <form onSubmit={this.handleSubmit} value={method}>
                        <select name="method" onChange={this.handleMethodChange}>
                            <option value=" "> </option>
                            <option value="Reserve">Reserve a desk</option>
                            <option value="Cancel">Cancel a reservation</option>
                        </select>
                        {(method === "Reserve") ? <Redirect to = {{ pathname: "/reserve-date" }} /> : null}

                   {(userReservations.length > 0) ?
                    <div>
                      <table align="center" >
                        <thead>
                          <tr>
                            <th> Date (dd/mm/yyyy)</th>
                            <th> Desk Number </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userReservations.map(reservation => (
                              <tr key={reservation.day} align="center">
                                <td key={reservation.day}>
                                    {reservation.day}{"/"}{reservation.month}{"/"}{reservation.year}
                                </td>
                                <td key={reservation.index}>
                                    {reservation.deskNum}
                                </td>
                              </tr>      
                          ))}
                        </tbody>
                      </table> 
                      <br /><br /><br /><br /><br />
                    </div>
                    : <p className="font-rubik leading-normal text-text"> You don't have any upcoming reservations. </p> }
                    </form>
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

const rectangle3 = {   //for table
  width: 1080,
  height: 600,
  borderRadius: 5,
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#c4c4c4"
};

export default withAlert()(Reservations);
