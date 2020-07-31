import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';

/* implement max desk for form validation */

class ReserveSelect extends React.Component {
    constructor() {
        super()
        this.state = {
            deskNum: 0,
            desks:[],
            maxDesk: 0
        }
        this.routeChangeBack = this.routeChangeBack.bind(this);
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit= this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { desks } = this.state
        axios
            .get(`URL HERE`)
            .then(response => {
                console.log(response)
                response.data.desks.map((id, Xcoord, Ycoord, pixXcoord, pixYcoord, index) => {
                    const newDesk = {
                        deskNum: id,
                        Xcoord: Xcoord,
                        Ycoord: Ycoord,
                        pixXcoord: pixXcoord,
                        pixYcoord: pixYcoord
                    };
                    desks.push(newDesk)
                })
                this.setState({
                    desks: this.state.desks,
                    maxDesk: desks.length - 1
                })
            })
            .catch(error => {
                console.log(error)
                //alert(error)
            })
        {/*get desk coordinates
        FROM HANDLEFLOORPLAN.JS
            allDesks.map((singleDesk) => 
                axios.post(`http://localhost:5000/seats/add`, {"id": singleDesk.seat_number, "Xcoord": singleDesk.coordinates[0], "Ycoord": singleDesk.coordinates[1], "pixXcoord": singleDesk.pix_coordinates[0], "pixYcoord": singleDesk.pix_coordinates[1]})
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => {
                        // console.log(error.response.data.error)
                        console.log(error)
                    })
            )*/}
    }
    handleClick(event) {
        const {name, value } = event.target
        this.setState({ 
            [name] : value,
            deskNum: 1
        })
    }

    handleSubmit(event) {
        const { deskNum, maxDesk } = this.state
        event.preventDefault()
        alert(`reserving desk ${deskNum} out of ${maxDesk} for EMAIL on DATE`)
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
        const { deskNum, desks } = this.state
        return (
            <div>
                <p className="h1"><strong> Reserve a Desk </strong></p>
                <form onSubmit={this.handleSubmit}>
                    <p className="font-rubik leading-normal text-text"> Select a desk from the floorplan below. </p>                    
                    <br/>
                    <img style={floorplan} src="https://i.pinimg.com/originals/ee/50/25/ee5025099140b6697668a340c930c879.jpg" onClick={this.handleClick} />
                    <br/><br/>

                    {( desks.length > 0 ) ?
                        <div> <h1> there are desks to display </h1> </div>
                    :   null}

                    {(deskNum <= 0) ?
                        <div>
                            <button style={back} onClick={this.state.routeChangeBack}>Back</button>
                            <button style={reserveButtonInactive}>Reserve</button>
                        </div>
                        :
                        <div>
                            <p className="h6"><strong> You have selected Desk {deskNum} </strong></p>
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