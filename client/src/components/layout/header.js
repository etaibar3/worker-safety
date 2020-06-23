import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
    // works like the render does
    return(
        <header style={headerStyle}>
            <Link style={linkStyle} >
                <h1 to="/">Worker Safety</h1>
            </Link>
        </header> 
    )
}

const headerStyle = {
    background: '#333',
    color: 'white',
    textAlign: 'left',
    padding: '10px',
}

const linkStyle = {
    color: 'white',
    textDecoration: 'none'
}

export default Header;