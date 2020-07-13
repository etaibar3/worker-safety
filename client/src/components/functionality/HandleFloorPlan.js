// HandleFloorPlan.js
// Displays the image and implements functionality of marking desk

import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

export const HandleFloorPlan = (props) => {
    const [allDesks, addDesk] = useState([]);
    const [deskCount, setDeskCount] = useState(0);

    const markDesk = (e) => {
        const xPos = e.clientX;
        const yPos = e.clientY;
    
        const desk = {
            seat_number: deskCount,
            available: true,
            type: 'point',
            coordinates: [
                xPos,
                yPos - 210
            ]
        }

        addDesk(allDesks.concat(desk)); // adds the desk to the allDesks array in the state
        try {
            axios.post('http://localhost:5000/seats', {desk})
            .then(res => {
                console.log(res);
            });
        } catch(err) {
            console.log(err);
        }

        // for tracking the ID of the desk
        let tempDeskCount = deskCount + 1;
        setDeskCount(tempDeskCount);
    }

    return (
        <div id="wrapper" style={wrapperStyle} >
            <img src={props.imageSrc} width="400px" style={imgStyle} onClick={markDesk} alt=""/>
            { allDesks.map((singleDesk) => 
                <div key={singleDesk.seat_number}>
                    <img src="https://www.pngmart.com/files/4/Circle-PNG-File.png" alt="Desk" 
                    style={{
                        position: 'absolute',
                        left: singleDesk.coordinates[0],
                        top: singleDesk.coordinates[1],
                        width: '20px'
                    }}/>
                </div>
            )}
        </div>
    )
}

const wrapperStyle = {
    textAlign: 'center',
    position: 'relative',
    top: 0,
    left: 0
}

const imgStyle = {
    position: 'relative',
    top: 0,
    left: 0
}

HandleFloorPlan.propTypes = {
    imageSrc: PropTypes.string,
}

export default HandleFloorPlan;
