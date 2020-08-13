// Component: Reservations
// Description: This is the reservations page where employees can view, cancel,
//      and begin making a reservation

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
            userReservations: [],
            redirect: false
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.routeChange = this.routeChange.bind(this)
    }

    componentDidMount() {
        if (sessionStorage.getItem('loggedIn') === "false" ) {
            console.log("not logged in");
            this.setState({redirect: true});
        } 

        {/* Get reservations here */}
        const { userReservations } = this.state
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]
        const dayNames= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        axios
            .get(`/reservations`)
            .then(response => {
                console.log(response)
                response.data.reservations.map((reservation, index) => {
                  let dateString = monthNames[reservation.date.month.low - 1] + " " + reservation.date.day.low.toString() + "," + reservation.date.year.low.toString()
                  let date = new Date(dateString)
                  
                  const newReservation = {
                      deskNum: reservation.id,
                      day: reservation.date.day.low,
                      dayName: dayNames[date.getDay()],
                      month: reservation.date.month.low,
                      monthName: monthNames[reservation.date.month.low - 1],
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
                if(error.response !== undefined)  {
                    this.props.alert.error(error.response.data.error)
                    console.log(error.response.data.error)
                }
            })
    }   

    handleChange(event) {
        const {name, value } = event.target
        this.setState({ [name] : value })
    }

    routeChange() {
      let path = `/reserve-date`;
      this.props.history.push(path);
    }

    deleteRes(event) {
      alert(`Day: ${event.day} Month: ${event.month} Year: ${event.year} Desk: ${event.deskNum}`)
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]
      //let dateString = monthNames[event.month - 1] + " " + event.day.toString() + "," + event.year.toString()
      //let dateObj = new Date(dateString)

      let dateString = event.year.toString() + "-" + event.month.toString() + "-" + event.day.toString()
      alert(dateString)
      axios
          .delete(`/reservations`, {data: {'date': dateString }})
          .then(response => {
              console.log(response)
              alert(`success deleting reservation`)
              this.props.alert.success('Reservation succesfully deleted.')
          })
          .catch(error => {
              console.log(error)
              alert(`error deleting reservation`)
              //this.props.alert.error(error.response.data.error)
          })
      return false
    } 

    render() {
        const { method, userReservations, redirect } = this.state
        if (redirect) {
          return <Redirect to = {{ pathname: "/login" }} />
        }
        return (
            <div>
                <p className="h1"><strong> Reservations </strong></p>
                <button style={reserveBlue} onClick={this.routeChange}>Reserve</button> 
                <br /><br />
                {(userReservations.length > 0) ?
                  <div>
                    <table align="center" >
                      <thead>
                        <tr>
                          <th> Date</th>
                          <th> Desk Number </th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {userReservations.map(reservation => (
                            <tr key={reservation.day} align="center">
                              <td key={reservation.day}>
                                  {reservation.dayName}{", "}{reservation.monthName}{" "}{reservation.day}{", "}{reservation.year}
                              </td>
                              <td key={reservation.index}>
                                  {reservation.deskNum}
                              </td>
                              <td>
                                  <button onClick={() => this.deleteRes(reservation)} style={removeButtonStyle}>
                                    Remove
                                  </button>
                              </td>
                            </tr>      
                        ))}
                      </tbody>
                    </table> 
                    <br /><br /><br /><br /><br />
                  </div>
                : <p className="font-rubik leading-normal text-text"> You don't have any upcoming reservations. </p> }
            </div>
        )
    }
}

const removeButtonStyle = {
    textAlign: 'center',
    color: "#2121ca",
};


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


export default withAlert()(Reservations);
