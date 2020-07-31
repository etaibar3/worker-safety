import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';


class ReserveSelect extends React.Component {
    constructor() {
        super()
        this.state = {
            desk: 0
        }
        this.routeChangeBack = this.routeChangeBack.bind(this);
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit= this.handleSubmit.bind(this);
    }

    componentDidMount() {
        {/* Get request for coordinates of desks */}
    }

    handleClick(event) {
        const {name, value } = event.target
        this.setState({ 
            [name] : value,
            desk: 1
        })
    }

    handleSubmit(event) {
        const { desk } = this.state
        event.preventDefault()
        alert(`reserving desk ${desk} for EMAIL on DATE`)
    {/* make sure desk num is valid integer 
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
    }

    routeChangeBack() {
        let path = `/reservations`;
        this.props.history.push(path);
    }

    render() {
        const { desk } = this.state
        return (
            <div>
                <p className="h1"><strong> Reserve a Desk </strong></p>
                <form onSubmit={this.handleSubmit}>
                    <p className="font-rubik leading-normal text-text"> Select a desk from the floorplan below. </p>                    
                    <br/>
                    <img style={floorplan} src="https://i.pinimg.com/originals/ee/50/25/ee5025099140b6697668a340c930c879.jpg" onClick={this.handleClick} />
                    <br/><br/>
                    {(desk === 0) ?
                        <div>
                            <button style={back} onClick={this.state.routeChangeBack}>Back</button>
                            <button style={reserveButtonInactive}>Reserve</button>
                        </div>
                        :
                        <div>
                            <p className="h6"><strong> You have selected Desk {desk} </strong></p>
                            <button style={back} onClick={this.state.routeChangeBack}>Back</button>
                            <button type="submit" style={reserveButtonActive} onSubmit={this.handleSubmit}>Reserve</button> 
                        </div>
                    }
                </form>
            <br/><br/>
            </div>
        )
    }
}

const text = {
  width: 192,
  height: 19,
  fontFamily: "Rubik",
  fontSize: 16,
  fontWeight: "500",
  fontStyle: "normal",
  letterSpacing: 0,
  color: "#222831"
};

const back = {
  width: 113,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#ffffff",
  color: "#2121ca"
};

const reserveButtonActive = {
  width: 131,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#2121ca",
  color:"#ffffff"
};

const reserveButtonInactive = {
  width: 131,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#c4c4c4",
  color:"#ffffff"
};

const floorplan = {
  display: "flex",
  align: 'center'
};

export default ReserveSelect