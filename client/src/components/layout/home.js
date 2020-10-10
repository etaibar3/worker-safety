import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Grid } from "@material-ui/core";
import BigShoes from "../../assets/icons/BigShoes.PNG";
import socialDistance from "../../assets/icons/socialDistance.PNG";
import AdminNavBar from "./AdminNavBar"
import NavBar from "./navbar";

class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            getStartedRedirect: false
        };
        this.routeChange = this.routeChange.bind(this)     
    }

    routeChange() {
        this.setState({
            getStartedRedirect: true
        })
    }

    render() {
        if (this.state.getStartedRedirect) {
            return (<Redirect to = {{ pathname: "/create-root-account" }} />)
        }
        else {
            return (
                <div>
                <br />
                <AdminNavBar />
                <br /><br />
                    <Grid container style={gridStyleMain} direction="row" justify="space-evenly" alignItems="left" >
                        <Grid item xs={4} style={boxStyle1}>
                            <h1> Worker safety is our top priority </h1>
                            <br />
                            <p> 
                                Safe Return allows companies to track and manage desk 
                                reservations as employees return to the office after the
                                COVID-19 pandemic.
                            </p>
                            <br />
                            <button type="button" style={getStartedStyle} onClick={() => this.routeChange()}>
                                Get Started
                            </button>
                        </Grid>
                        <Grid item xs={7}>
                            <br /><br /><br />
                            <img src={BigShoes} width="53%" height="40%"/>
                        </Grid>
                    </Grid>
                    <Grid container style={gridStyleCenter} direction="column" justify="space-evenly" alignItems="center" >
                        <br /><br /><br />
                        <Grid item xs={4} alignItems="center">
                            <h3> <strong>Social distancing made easy </strong></h3>
                            <br />
                            <p> 
                                Upload your office floor plan into our desk reservation system,
                                and we will make sure all available desks are at least 6 feet apart.
                            </p>
                        </Grid>
                        <Grid item xs={7}>
                            <br /><br /><br />
                            <img src={socialDistance} width="90%" height="40%" borderWidth="5px" borderColor="#555" borderRadius="1px" />
                        </Grid>
                    </Grid>
                </div>
            )
        }
    }
}

const getStartedStyle = {
  width: 125,
  height: 50,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#2121ca",
  color:"#ffffff",
  lineHeight: 3,
};

const gridStyleMain = {
    gridGap: "15px",
    padding: "15px",
    justify: "center",
    alignItems: "left",
    paddingLeft: "25%"
};

const gridStyleCenter = {
    gridGap: "15px",
    padding: "15px",
    justify: "center",
    alignItems: "left",
};

const boxStyle1 = {
    justifyItems: "left",
    padding: "15px",
    alignText: "flex-start"
};

const boxStyle2 = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px"
};

export default Home;
