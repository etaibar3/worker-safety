// HandleFloorPlan.js
// Displays the image and implements functionality of marking desk

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export const HandleFloorPlan = (props) => {
    const [allDesks, addDesk] = useState([]);
    const [deskCount, setDeskCount] = useState(0);

    const markDesk = (e) => {
        // const xPos = e.clientX;
        // const yPos = e.clientY;

        const xPos = e.nativeEvent.layerX;
        const yPos = e.nativeEvent.layerY;
    
        const desk = {
            id: deskCount,
            xPosition: xPos + 195,
            yPosition: yPos
        }
        console.log(allDesks);
        addDesk(allDesks.concat(desk)); // adds the desk to the allDesks array in the state
    
        // for tracking the ID of the desk
        let tempDeskCount = deskCount + 1;
        setDeskCount(tempDeskCount);
    }

    return (
        <div id="wrapper" style={wrapperStyle} >
            <img src={props.imageSrc} width="400px" style={imgStyle} onClick={markDesk}/>
            { allDesks.map((singleDesk) => 
                <div>
                    <img src="https://www.pngmart.com/files/4/Circle-PNG-File.png" alt="Desk"
                    style={{
                        position: 'absolute',
                        left: singleDesk.xPosition,
                        top: singleDesk.yPosition,
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