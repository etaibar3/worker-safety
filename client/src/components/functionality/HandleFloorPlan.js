// HandleFloorPlan.js
// Displays the image and implements functionality of marking desk

import React, { useState, useEffect, useRef } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

export const HandleFloorPlan = (props) => {
    const [allDesks, addDesk] = useState([]);
    const [deskCount, setDeskCount] = useState(1);

    const markDesk = (e) => {
        if (props.imageSrc !== "") {
            const xPos = e.nativeEvent.offsetX;
            const yPos = e.nativeEvent.offsetY;
        
            const desk = {
                seat_number: deskCount,
                available: true,
                type: 'point',
                coordinates: [
                    xPos,
                    yPos
                ]
            }

            addDesk(allDesks.concat(desk)); // adds the desk to the allDesks array in the state

            // for tracking the ID of the desk
            let tempDeskCount = deskCount + 1;
            setDeskCount(tempDeskCount);

        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        // This will be used later to make database requests
    }

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image;
        img.src = props.imageSrc;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 500, 500);
            allDesks.map((singleDesk) => {
                ctx.fillStyle = "#2b60a6"
                const sX = singleDesk.coordinates[0] - 15;
                const sY = singleDesk.coordinates[1] - 15;
                ctx.fillRect(sX, sY, 30, 30);
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.fillText(singleDesk.seat_number, sX + 10, sY + 22);
            })
        }
    });

    return (
        <div id="wrapper" style={wrapperStyle} >
            <canvas ref={canvasRef} width={500} height={500} style={canvasStyle} onClick={markDesk}></canvas>
            <input onMouseUp={onSubmit} type="submit" value="Upload" style={uploadStyle}/>
        </div>
    )
}

const wrapperStyle = {
    textAlign: 'center',
}

const canvasStyle = {
    paddingLeft: '0',
    paddingRight: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
}

const uploadStyle = {
    position: 'relative',
    margin: '20px',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingRight: '20px',
    paddingLeft: '20px',
    background: '#eee',
    fontSize: '14px',
    border: 'solid',
    borderColor: 'black',
    borderWidth: '1px',
    borderRadius: '25px',
}

HandleFloorPlan.propTypes = {
    imageSrc: PropTypes.string,
}

export default HandleFloorPlan;
