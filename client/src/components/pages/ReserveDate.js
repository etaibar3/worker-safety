// Component: ReserveDate
// Description: Component for employees to reserve a desk

//TODO: allow employees to make recurring reservations (select multiple dates at once)

import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';
import ReserveSelect from './ReserveSelect'


class ReserveDate extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            status: 400,
            date: "",
            min: new Date(),
            showDesks: false,
            desk: null,
            image: new Image(),
            maxDesk: 0
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.routeChangeCont = this.routeChangeCont.bind(this);
        this.routeChangeCancel = this.routeChangeCancel.bind(this);
    }

    componentDidMount() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        this.setState({
            min: today
        })
        {/*axios
         .get(`http://localhost:5000/upload/`)
         .then(response => {
            console.log(response)
            alert(response)
            this.setState({
                image: response.image
            })
         })
         .catch(error => {
            console.log(error)
            alert(error)
            this.setState({
                status: error.response.status
            })
         }) */}
    }

    handleChange(event) {
        const {name, value } = event.target
        this.setState({ 
            [name] : value,
            showDesks: true
        })
    }

    handleSubmit(event) {
        event.preventDefault()
    {/* make sure desk num is valid integer 
        alert(`reserving desk ${this.state.desk} on ${this.state.date} for EMAIL`)
        axios
                .post(`URL HERE`, { 'date': this.state.date, 'deskNum': this.state.desk }) 
                .then(response => {
                    console.log(response)
                    this.props.alert.success('Success')
                })
                .catch(error => {
                    console.log(error)
                    this.props.alert.error(error.response.data.error)
                })*/}
    alert(`here`)
    }

    routeChangeCont() {
        let path = `/reserve-select`;
        this.props.history.push(path);
    }

    routeChangeCancel() {
        let path = `/reservations`;
        this.props.history.push(path);
    }


    render() {
        const { email, desk, status, date, min, showDesks, maxDesk } = this.state
        return (
            <div>
                <p className="h1"><strong> Reserve a Desk </strong></p>
                <form onSubmit={this.handleSubmit}>
                    <p className="font-rubik leading-normal text-text"> Select a date for your desk reservation. </p>                    
                    <br/>
                    <label className="h6">
                        <strong> Reservation Date </strong>
                        <br />
                        <input
                            className="rounded bg-primary-light border border-border max-w-xs"
                            type="date"
                            name="date"
                            value={date}
                            min={min}
                            onChange={this.handleChange}
                        />
                    </label>
                    <br /><br />
                    {(showDesks) ? 
                    <div>
                        <button style={cancel} onClick={this.routeChangeCancel}>Cancel</button>
                        <button type="submit" style={continueButton} onClick={this.routeChangeCont}>Continue</button>
                    </div> 
                    : null}
                </form>
            </div>
        )
    }
}


const reserveADesk = {
  width: 290,
  height: 41,
  fontFamily: "Rubik",
  fontSize: 35,
  fontWeight: "bold",
  fontStyle: "normal",
  letterSpacing: 0,
  color: "#222831"
};

const selectADateForYourDeskReservation = {
  width: 290,
  height: 24,
  fontFamily: "Rubik",
  fontSize: 16,
  fontWeight: "normal",
  fontStyle: "normal",
  lineHeight: 2,
  letterSpacing: 0,
  color: "#222831"
};

const reservationDate = {
  width: 133,
  height: 19,
  fontFamily: "Rubik",
  fontSize: 16,
  fontWeight: "1000",
  fontStyle: "normal",
  letterSpacing: 0,
  color: "#222831"
};

const rectangle4 = {
  width: 280,
  height: 49,
  borderRadius: 5,
  backgroundColor: "#000000",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#c4c4c4"
};

const cancel = {
  width: 113,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#ffffff",
  color: "#2121ca"
};

const continueButton = {
  width: 131,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#2121ca",
  color:"#ffffff"
};

export default ReserveDate
