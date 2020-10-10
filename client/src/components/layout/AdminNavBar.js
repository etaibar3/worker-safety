import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminMenuItems } from './AdminMenuItems';
import { Redirect } from 'react-router';
import axios from 'axios';
import { withAlert } from 'react-alert';


class AdminNavBar extends React.Component {
    constructor() {
        super()
        this.state = {
            redirectTeam: false,
            redirectReservations: false,
            redirectFloorplan: false,
            redirectReportACase: false,
            redirectLogout: false
        }
        this.routeChange = this.routeChange.bind(this)     
    }

    routeChange(route) {
        this.setState({
            redirectTeam: false,
            redirectReservations: false,
            redirectFloorplan: false,
            redirectReportACase: false,
            redirectLogout: false
        })
        if (route === "/roster") {
            this.setState({
                redirectTeam: true
            })
        }
        else if (route === "/reservations") {
            this.setState({
                redirectReservations: true
            })
        }
        else if (route === "/upload-floor-plan") {
            this.setState({
                redirectFloorplan: true
            })
        }
        else if (route === "/report-a-case") {
            this.setState({
                redirectReportACase: true
            })
        }
        else if (route === "/logout") {
          axios
              .delete(`/logout`)
              .then(response => {
                  axios.defaults.headers.common['auth'] = ''
                  console.log(response)
                  this.setState({ 
                      status: response.status 
                  })
                  this.props.alert.success('Logged out')
              })
              .catch(error => {
                  console.log(error)
                  if(error.response !== undefined)  {
                      this.props.alert.error(error.response.data.error)
                  }
              })
            this.setState({
                redirectLogout: true
            })
        }
    }

    render() {
        return (
            <div>
                {(this.state.redirectTeam) ? <Redirect to = {{ pathname: "/roster" }} /> : null}
                {(this.state.redirectReservations) ? <Redirect to = {{ pathname: "/reservations" }} /> : null}
                {(this.state.redirectFloorplan) ? <Redirect to = {{ pathname: "/upload-floor-plan" }} /> : null}
                {(this.state.redirectReportACase) ? <Redirect to = {{ pathname: "/report-a-case" }} /> : null}
                {(this.state.redirectLogout) ? <Redirect to = {{ pathname: "/" }} /> : null}
                <nav style={navStyle}>
                    <Link to='/' style={navLogo}> Safe Return </Link>
                    <ul style={navMenu}>
                        {AdminMenuItems.map((item, index) => {
                            return (
                            <div>
                                {(item.cName === "nav-links") ?
                                    <Link to={item.url} style={navLinks}> {item.title} </Link>
                                    : null }
                                {(item.cName === "logoutStyle") ?
                                    <button type="button" style={logoutStyle} onClick={() => this.routeChange(item.url)}>
                                        {item.title}
                                    </button>
                                    : null }
                            </div>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        )
    }
}

const navStyle = {
    height: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "#C4C4C4",
    paddingBottom: 10,
};

const navLogo = { 
  display: "grid",
  justifySelf: "start",
  marginLeft: "10px",
  align: "left",
  width: 270,
  height: 40,
  borderRadius: 5,
  fontWeight: "1000",
  fontSize: "35px",
  color:"#000000",
};

const navMenu = {
    display: "grid",
    gridGap: "5%",
    gridTemplateColumns: "repeat(5, auto)",
    textAlign: "center",
    width: "70vw",
    justifyContent: "end",
    marginRight: "2rem",
    listStyle: "none"
};

const logoutStyle = {
  width: 125,
  height: 50,
  borderRadius: 5,
  borderWidth: 2,
  borderColor: "#2121ca",
  fontWeight: "500",
  backgroundColor: "#ffffff",
  color: "#2121ca",
  lineHeight: 3,
};


const navLinks = {
  color: "#6c6c6c",
  lineHeight: 3,
  fontWeight: "500",
}

export default withAlert()(AdminNavBar);
