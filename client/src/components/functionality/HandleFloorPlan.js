// HandleFloorPlan.js
// Displays the image and implements functionality of marking desk

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

export const HandleFloorPlan = (props) => {
    const [allDesks, addDesk] = useState([]);
    const [deskCount, setDeskCount] = useState(1);
    const [buttonText, setText] = useState('Upload');
    const [scaleValue, setScaleValue] = useState(1);
    const [feetValue, setFeetValue] = useState(1);
    const [scaleOriginX, setOriginX] = useState(0);
    const [scaleOriginY, setOriginY] = useState(0);

    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image;
        img.src = props.imageSrc;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 500, 500);

            const element = <h2>Step 1: Mark desk locations by clicking on the floor plan</h2>
            ReactDOM.render(element, document.getElementById('header1'));

            // Set the button text
            if(document.getElementById('header2').childElementCount > 0) {
                setText('Upload');
            } else {
                setText('Done');
            }

            // Creating all the desks
            allDesks.map((singleDesk) => {
                ctx.fillStyle = "#2b60a6"
                const sX = singleDesk.coordinates[0];
                const sY = singleDesk.coordinates[1] ;
                ctx.fillRect(sX - 15, sY - 15, 30, 30);
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.fillText(singleDesk.seat_number, sX - 5, sY + 7);
            })

            // Creating the scale rectangle
            ctx.fillStyle = "black"
            var value = parseFloat(10) + parseFloat(scaleValue);
            console.log(`Start point: ${scaleOriginX}`);
            console.log(`End point: ${scaleOriginX + value}`);
            ctx.fillRect(scaleOriginX, scaleOriginY, value, 10);
        }
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (buttonText === "Done") {
            const element = <h2>Step 2: Set the scale of the image</h2>
            ReactDOM.render(element, document.getElementById('header2'));
            setText('Upload');
        } else {
            console.log("Post things")
        }
        const ppf = scaleValue / feetValue;
        allDesks.map(desk => {
            desk.coordinates[0] = desk.coordinates[0] / ppf;
            desk.coordinates[1] = desk.coordinates[1] / ppf;
            console.log('(' + desk.coordinates[0] + ', '+  desk.coordinates[1] + ')');
        });
        
        // Posting desk stuff
        // allDesks.map((singleDesk) => 
        //     axios.post(`http://localhost:5000/seats`, { 'seat_number': singleDesk.seat_number, 'available': true, 'geometry': {'type': 'point', 'coordinates': [singleDesk.coordinates[0], singleDesk.coordinates[1]]}})
        //         .then(response => {
        //             console.log(response)
        //         })
        //         .catch(error => {
        //             // console.log(error.response.data.error)
        //             console.log(error)
        //         })
        // )

        // Also need to post scale stuff
    }

    const markDesk = (e) => {
        if (props.imageSrc !== "") {
            if (buttonText === "Done") {
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
            } else {
                findScale(e);
            }
        }
    }

    const deleteDesk = (e) => {
        // console.log("Todo")
    }

    const findScale = (e) => {
        var input = document.getElementById("wrap-inputPx");
        input.style = {display: 'block'}
        var input2 = document.getElementById("wrap-inputFt");
        input2.style = {display: 'block'}

        const xPos = e.nativeEvent.offsetX;
        const yPos = e.nativeEvent.offsetY;

        setOriginX(xPos);
        setOriginY(yPos);
    }

    const auxScale = (e) => {
        var input = document.getElementById("inputPx");
        setScaleValue(input.value);
    }

    const auxFeet = (e) => {
        var input = document.getElementById("inputFt");
        setFeetValue(input.value);
    }

    return (
        <div id="wrapper" style={wrapperStyle} >
            <div id="header1"></div>
            <div id="header2"></div>
            
            <canvas id="canvas" ref={canvasRef} width={500} height={500} style={canvasStyle} onClick={markDesk} onMouseMove={deleteDesk}></canvas>
            <div id="wrap-inputPx" style={{display: 'none'}}>
                <label htmlFor="inputPx">Adjust size of the scale line: </label>
                <input id="inputPx" onChange={auxScale} type="number" min="1" placeholder="1" ></input>
            </div>
            <div id="wrap-inputFt" style={{display: 'none'}}>
                <label htmlFor="inputFt">How many feet does this correspond to? </label>
                <input id="inputFt" onChange={auxFeet} type="number" min="1" placeholder="1" ></input>
            </div>
            <input onMouseUp={onSubmit} type="submit" value={buttonText} style={uploadStyle}/>
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
