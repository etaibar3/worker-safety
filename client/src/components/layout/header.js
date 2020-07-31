import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
    // works like the render does
    return(
        <header style={headerStyle}>
            <Link style={linkStyle}  to="/" >
                <h1>Safe Return</h1>
            </Link>
        </header> 
    )
}

const headerStyle = {
    background: '#333',
    color: 'white',
    textAlign: 'left',
    padding: '10px',
    border: 'none',
    borderBottom: 'solid',
    borderWidth: '1px'
}

const linkStyle = {
    color: 'white',
    textDecoration: 'none'
}

export default Header;