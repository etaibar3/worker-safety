// HandleFloorPlan.js
// Displays the image and implements functionality of marking desks

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export const HandleFloorPlan = (props) => {
    const [source, setSource] = useState(props.imageSrc);

    return (
        <div id="wrapper" style={wrapperStyle} onClick={markDesk}>
            <img src={props.imageSrc} width="400px"></img>
        </div>
    )
}

HandleFloorPlan.propTypes = {
    imageSrc: PropTypes.string
}

const markDesk = (e) => {
    console.log(e.clientX); // tells X position of mouse from window
    console.log(e.clientY);

    // console.log(e.offsetX); // tells mouse pos within the elem
    // console.log(e.offsetY)

    const xPos = e.clientX;
    const yPos = e.clientY;

    const desk = (
        <div /*id="wrapper" style={wrapperStyle} onClick={markDesk}*/>
            <img src="https://www.pngmart.com/files/4/Circle-PNG-File.png" alt="Desk" 
            style={{
                position: 'absolute',
                left: xPos - 5,
                top: yPos  - 5,
                width: '20px'
            }}/>
        </div>
    );
    ReactDOM.render(desk, document.getElementById('wrapper'));
}

const wrapperStyle = {
    textAlign: 'center'
}

export default HandleFloorPlan;