import  React, { useRef } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router';

/* implement max desk for form validation */

class ReserveSelect extends React.Component {
    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()
        this.state = {
            deskNum: 0,
            desks:[],
            maxDesk: 0,
            date: props.date,
            status: 400,
            numUpdates: 0
        }
        this.routeChangeBack = this.routeChangeBack.bind(this);
        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit= this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { desks } = this.state
      {/* Getting desk coordinates and numbers*/}
        axios
            .get(`http://localhost:5000/seats/${this.state.date}`)
            .then(response => {
                console.log(response)
                response.data.seats.map((seat, index) => {
                    const newDesk = {
                        deskNum: seat.id,
                        pixXcoord: seat.pix_x,
                        pixYcoord: seat.pix_y
                    };
                    desks.push(newDesk)
                })
                this.setState({
                    maxDesk: desks.length
                })
            })
            .catch(error => {
                console.log(error)
            }) 

        {/* GET IMAGE FROM DB
        axios
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

    handleClick(event) {
        const {name, value } = event.target
        this.setState({ 
            [name] : value,
            deskNum: 3
        })
    }

    handleSubmit = async event => {
        const { date, deskNum, maxDesk, status } = this.state
        event.preventDefault()
      {/*REMOVE THIS*/}
        this.setState({
          status: 200
        })
        //alert(`reserving desk ${deskNum} out of ${maxDesk} for EMAIL on ${date}`)
      {/* Posting desk reservation */}
          await axios
            .post(`http://localhost:5000/reservations`, { 'date': date, 'seat_number': deskNum }) 
            .then(response => {
                console.log(response)
                this.props.alert.success('Success')
                this.setState({
                  status: response.status
                })
            })
            .catch(error => {
                console.log(error)
                //console.log(error.response.data.error)
                //this.props.alert.error(error.response.data.error)
            })
    }

    routeChangeBack() {
        let path = `/reservations`;
        this.props.history.push(path);
    }
    
    componentDidUpdate() {
    {/* Displays all the desks */}
      if (this.state.numUpdates < 1) {
        const { desks } = this.state
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = "https://lh3.googleusercontent.com/Gjj4MhMrRWYHMMWunZZdskl8WWkvSApzx_Va3PzM1hxKWQz4rpxLtXvqYjkKCEBHM3HPVquWbWPYFmx_77z_KKoXNGTlocMAn4_pCDI85XsbCWwdWihW_OxcZx9VVIoTMqoOhhFT4w" 
        //img.src = "https://external-preview.redd.it/vQmMvI6xk-2MHbkPDOJDO_HDDM_l2qR61gwd0nAC2go.jpg?auto=webp&s=f9fa784d471d0ed203fbf63530cc8f4db6454063"
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 500, 500);

            // Creating all the desks
            desks.forEach((singleDesk) => {
                ctx.fillStyle = "#2b60a6"
                const sX = singleDesk.pixXcoord;
                const sY = singleDesk.pixYcoord;
                ctx.fillRect(sX - 15, sY - 15, 30, 30);
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.fillText(singleDesk.deskNum, sX - 5, sY + 7);
            })
        }
        this.setState({
          numUpdates: 1
        })
      }
    }


    render() {
        const { deskNum, desks, status, date } = this.state
        return (
          <div>
            {(status >= 200 && status < 300) ? 
              <div>
                <h1> Success! </h1>
                <p className="font-rubik leading-normal text-text"> You have reserved desk {deskNum} on August 3, 2020. </p>                    
              </div> :
            <div>
                <p className="h1"><strong> Reserve a Desk </strong></p>
                <form onSubmit={this.handleSubmit}>
                    <p className="font-rubik leading-normal text-text"> Select a desk from the floorplan below. </p>                    
                    <br/><br/>

                    {( desks.length > 0 ) ?
                        <canvas ref={this.canvasRef} style={canvasStyle} onClick={this.handleClick} width={500} height={500}/>
                    : null}

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

export default ReserveSelect