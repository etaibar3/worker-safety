import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {MenuItems} from './MenuItems';
import { Redirect } from 'react-router';

class NavBar extends React.Component {
    constructor() {
        super()
        this.state = {
            redirectLogin: false,
            redirectSignUp: false,
            redirectAbout: false,
            redirectResources: false
        }
        this.routeChange = this.routeChange.bind(this)     
    }

    routeChange(route) {
        this.setState({
            redirectLogin: false,
            redirectSignUp: false,
            redirectAbout: false,
            redirectResources: false
        })
        if (route === "/") {
            this.setState({
                redirectResources: true
            })
        }
        else if (route === "/learn-more") {
            this.setState({
                redirectAbout: true
            })
        }
        else if (route === "/login") {
            this.setState({
                redirectLogin: true
            })
        }
        else if (route === "/create-root-account") {
            this.setState({
                redirectSignUp: true
            })
        }
    }

    render() {
        return (
            <div>
                {(this.state.redirectResources) ? <Redirect to = {{ pathname: "/" }} /> : null}
                {(this.state.redirectAbout) ? <Redirect to = {{ pathname: "/learn-more" }} /> : null}
                {(this.state.redirectSignUp) ? <Redirect to = {{ pathname: "/create-root-account" }} /> : null}
                {(this.state.redirectLogin) ? <Redirect to = {{ pathname: "/login" }} /> : null}
                <nav style={navStyle}>
                    <Link to='/' style={navLogo}> Safe Return </Link>
                    <ul style={navMenu}>
                        {MenuItems.map((item, index) => {
                            return (
                            <div>
                                {(item.cName === "nav-links") ?
                                    <button type="button" style={navLinks} onClick={() => this.routeChange(item.url)}>
                                        {item.title}
                                    </button>
                                    : null }
                                {(item.cName === "loginStyle") ?
                                    <Link to={item.url} style={navLinks}> {item.title} </Link>
                                    : null }
                                {(item.cName === "signUpStyle") ?
                                    <button type="button" style={signUpStyle} onClick={() => this.routeChange(item.url)}>
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

const loginStyle = {
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

const signUpStyle = {
  width: 125,
  height: 50,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#2121ca",
  color:"#ffffff",
  lineHeight: 3,
};

const navLinks = {
  color: "#6c6c6c",
  lineHeight: 3,
  fontWeight: "500",
}

export default NavBar;
