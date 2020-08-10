// Component: ReserveSelect
// Description: Component for employees to choose the desk they'd like to reserve
//              while confirming that the desk is available on the date they selected

import  React, { useRef } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';
import { withAlert } from 'react-alert';


class ReserveSelect extends React.Component {
    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()
        this.state = {
            deskNum: 0,
            desks:[],
            date: props.date,
            status: 400,
            numUpdates: 0,
            validRes: true, //validRes=true if the selected desk is available
            imgURL: "",
            userReservations: []
        }
        this.routeChangeBack = this.routeChangeBack.bind(this);
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit= this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { desks, userReservations } = this.state
      {/* Getting desk coordinates and numbers*/}
        axios
            .get(`http://localhost:5000/seats/${this.state.date}`)
            .then(response => {
                console.log(response)
                response.data.seats.map((seat, index) => {
                    const newDesk = {
                        deskNum: seat.id,
                        pixXcoord: seat.pix_x,
                        pixYcoord: seat.pix_y,
                        isReserved: seat.isReserved
                    };
                    desks.push(newDesk)
                })
            })
            .catch(error => {
                console.log(error)
            })

      {/* Getting floorplan image from DB*/}
        axios
         .get(`http://localhost:5000/FLOORPLANURLHERE/`)
         .then(response => {
            console.log(response)
            alert('success requesting floorplan')
            this.setState({
                imgURL: response.image
            })
         })
         .catch(error => {
            console.log(error)
            alert('floorplan request failed')
            this.setState({
                status: error.response.status
            })
         })
    }

    handleClick(event) {
        const {name, value} = event.target
        const { date, deskNum, desks, userReservations } = this.state
        this.setState({ 
          [name] : value,
        })

        let intDesk = parseInt(deskNum, 10)

        let validDesk = true
      {/* Check if the desk is available*/}
        desks.forEach((singleDesk) => {
          if (singleDesk.deskNum === intDesk) {
            if (singleDesk.isReserved === true) {
              validDesk = false
            }
          }
        })
        this.setState({
          validRes: validDesk
        })
    }

    handleSubmit(event) {
        const { date, deskNum, desks, userReservations } = this.state
        event.preventDefault()
        let intDesk = parseInt(deskNum, 10)

      {/* Posting desk reservation */}
        if (this.state.validRes) {
          axios
            .post(`http://localhost:5000/reservations`, { 'date': date, 'seat_number': intDesk }) 
            .then(response => {
                console.log(response)
                this.props.alert.success('Success')
                this.setState({
                  status: response.status
                })
            })
            .catch(error => {
                console.log(error)
                alert('error posting reservation')
                //console.log(error.response.data.error)
                if(error.response !== undefined)  {
                  this.props.alert.error(error.response.data.error)
                }
            })
        }
        else {
          alert(`This desk is already reserved. DELETE THIS MSG ReserveSelect`)
        }
    }

    routeChangeBack() {
        let path = `/reservations`;
        this.props.history.push(path);
    }
    
    componentDidUpdate() {
    {/* Displays all the desks */}
      //if (this.state.numUpdates < 1) {
        const { desks } = this.state
        const canvas = this.canvasRef.current;
        if (canvas !== null) {
          const ctx = canvas.getContext("2d");
          const img = new Image();
          //img.src = "https://external-preview.redd.it/vQmMvI6xk-2MHbkPDOJDO_HDDM_l2qR61gwd0nAC2go.jpg?auto=webp&s=f9fa784d471d0ed203fbf63530cc8f4db6454063"
          img.src = this.state.imgURL
          img.onload = () => {
              ctx.drawImage(img, 0, 0, 500, 500);

              // Creating all the desks
              desks.forEach((singleDesk) => {
                  {(singleDesk.isReserved) ? ctx.fillStyle = "#a0a0a0" : ctx.fillStyle = "#007600"}
                  const sX = singleDesk.pixXcoord;
                  const sY = singleDesk.pixYcoord;
                  ctx.fillRect(sX - 15, sY - 15, 30, 30);
                  ctx.fillStyle = "white";
                  ctx.font = "20px Arial";
                  ctx.fillText(singleDesk.deskNum, sX - 5, sY + 7);
              })
          }
          //this.setState({
            //numUpdates: 1
          //})
        }
      //}
    }


    render() {
        const { deskNum, desks, status, date, validRes } = this.state
        return (
          <div>
            {(status >= 200 && status < 300) ? 
              <div>
                <h1> Success! </h1>
                <p className="font-rubik leading-normal text-text"> You have reserved desk {deskNum} on {date}. </p>                    
              </div> :
              <div>
                <p className="h1"><strong> Reserve a Desk </strong></p>
                <form onSubmit={this.handleSubmit}>
                    <p className="font-rubik leading-normal text-text"> Select a desk from the floorplan below. </p>                    
                    <br/>
                    <select name="deskNum" onChange={this.handleClick}>
                                <option value=""></option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option> 
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                    </select>
                    <br/>
                    <canvas ref={this.canvasRef} style={canvasStyle} onClick={this.handleClick} width={500} height={500}/>
                    <br /><br />
                    {(deskNum <= 0) ?
                        <div>
                            {(validRes === false) ? 
                              <p className="h6">
                                <strong> 
                                  Desk {deskNum} is not available on the date you selected.  
                                </strong> 
                              </p> : null}
                            <button style={back} onClick={this.state.routeChangeBack}>Back</button>
                            <button type="button" style={reserveButtonInactive}>Reserve</button>
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
            </div> }
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

const canvasStyle = {
    paddingLeft: '0',
    paddingRight: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10px',
    display: 'block'
}

export default withAlert()(ReserveSelect);