import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return(
        <div style={navBarStyle}>
                <div style={navItemStyle}> <Link style={linkStyle} to="/know-your-rights"> <p>Know Your Rights</p> </Link> </div>
                <div style={navItemStyle}> <Link style={linkStyle} to="/learn-more"> <p>Learn more</p> </Link> </div>
                <div style={navItemStyle}> <Link style={linkStyle} to="/"> <p>Home</p> </Link> </div>
                <div style={navItemStyle}> <Link style={linkStyle} to="/login"> <p>Login</p> </Link> </div>
                <div style={navItemStyle}> <Link style={linkStyle} to="/logout"> <p>Logout</p> </Link> </div>
        </div>

    )
}

const linkStyle = {
    textDecoration: 'none',
}

const navBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0px',
    padding: '20px',
    background: '#333',
    listStyle: 'none',
    textAlign: 'left',
    width: '100%',
}

const navItemStyle = {
    margin: 'auto',
    textAlign: 'center',
    flexBasis: '15%',
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "white"
}

export default NavBar;
