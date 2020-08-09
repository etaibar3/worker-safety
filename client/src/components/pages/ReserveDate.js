// Component: ReserveDate
// Description: Component for employees to reserve a desk

//TODO: allow employees to make recurring reservations (select multiple dates at once)

import React from 'react'
import ReserveSelect from './ReserveSelect'


class ReserveDate extends React.Component {
    constructor() {
        super()
        this.state = {
            status: 400,
            date: new Date(),
            min: new Date(),
            dateChosen: false,
            desk: null,
            image: new Image(),
            continueClicked: false,
            maxDesk: 0,
            redirect: false
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.routeChangeCancel = this.routeChangeCancel.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('loggedIn') === "false" ) {
          console.log("not logged in");
          this.setState({redirect: true});
        } 
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        this.setState({
            min: today
        })
    }

    handleChange(event) {
        const {name, value } = event.target
        this.setState({ 
            [name] : value,
            dateChosen: true
        })
    }

    handleSubmit(event) {
      event.preventDefault()
        this.setState({ 
            continueClicked: true
        })
    }

    routeChangeCancel() {
        let path = `/reservations`;
        this.props.history.push(path);
    }


    render() {
        const { continueClicked, desk, status, date, min, dateChosen, redirect } = this.state
      
        if (redirect) {
          return <Redirect to = {{ pathname: "/login" }} />
        }

        return (
            <div>
              {(continueClicked === false) ?
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
                      {(dateChosen) ? 
                        <div>
                            <button style={cancel} onClick={this.routeChangeCancel}>Cancel</button>
                            <button type="submit" style={continueButton}>Continue</button>
                        </div> : null }
                  </form>
                </div> : null}
                    {(dateChosen && continueClicked) ? 
                      <ReserveSelect date={date}/>  
                    : null}
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
