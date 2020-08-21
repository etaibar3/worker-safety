// HandleFloorPlan.js
// Displays the image and implements functionality of marking desk

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

export const HandleFloorPlan = (props) => {
    const [allDesks, addDesk] = useState([]);
    const [buttonText, setText] = useState('Done');
    const [scaleValue, setScaleValue] = useState(1);
    const [feetValue, setFeetValue] = useState(1);
    const [usingFeet, setUsingFeet] = useState(false);
    const [scaleIsSet, setScale] = useState(false);
    const [meterValue, setMeterValue] = useState(1);
    const [usingMeters, setUsingMeters] = useState(false);
    const [scaleOriginX, setOriginX] = useState(0);
    const [scaleOriginY, setOriginY] = useState(0);
    const [forceUpdate, causeForceUpdate] = useState(1);

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = props.imageSrc;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 500, 500);

            const element = <h3>Step 1: Mark desk locations by clicking on the floor plan</h3>
            ReactDOM.render(element, document.getElementById('header1'));

            // Creating all the desks
            allDesks.forEach((singleDesk) => {
                ctx.fillStyle = "#2b60a6"
                const sX = singleDesk.pix_coordinates[0];
                const sY = singleDesk.pix_coordinates[1];
                ctx.fillRect(sX - 15, sY - 15, 30, 30);
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.fillText(singleDesk.seat_number, sX - 5, sY + 7);
        
            })

            // Creating the scale rectangle
            ctx.fillStyle = "black"
            var value = parseFloat(10) + parseFloat(scaleValue);
            ctx.fillRect(scaleOriginX, scaleOriginY, value, 10);
        }
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        var pixels_per_feet;
        const meters_per_foot = 0.3048;

        if (buttonText === "Done") {
            const element = <h3>Step 2: Set the scale of the image</h3>
            ReactDOM.render(element, document.getElementById('header2'));
            setText('Set Scale');
        } else {
            if(usingFeet === true) {
                pixels_per_feet = scaleValue / feetValue;
            } 
            else if (usingMeters === true){
                var ppm = scaleValue / meterValue;
                pixels_per_feet = ppm * meters_per_foot;
            }
            allDesks.forEach(desk => {
                if(pixels_per_feet !== undefined && scaleIsSet === false) {
                    desk.coordinates[0] = desk.coordinates[0] / pixels_per_feet;
                    desk.coordinates[1] = desk.coordinates[1] / pixels_per_feet;
                }
                console.log('Ft/M coords:' + '(' + desk.coordinates[0] + ', '+  desk.coordinates[1] + ')');
                console.log('Pix coords:' + '(' + desk.pix_coordinates[0] + ', '+  desk.pix_coordinates[1] + ')');
            });

            if (pixels_per_feet !== undefined) {
                setScale(true);
            }
           
            // Posting all desks
            allDesks.map((singleDesk) => 
                axios.post(`/seats/add`, {"id": singleDesk.seat_number, "Xcoord": singleDesk.coordinates[0], "Ycoord": singleDesk.coordinates[1], "pixXcoord": singleDesk.pix_coordinates[0], "pixYcoord": singleDesk.pix_coordinates[1]})
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => {
                        // console.log(error.response.data.error)
                        console.log(error)
                    })
            )
            var input = document.getElementById('handle-btn');
            input.style.visibility = "hidden";
        }
    }

    const markDesk = (e) => {
        if (props.imageSrc !== "") {
            if (buttonText === "Done") {
                const xPos = e.nativeEvent.offsetX;
                const yPos = e.nativeEvent.offsetY;
                var deletion = false;

                if (allDesks.length === 0) {
                    createDesk(xPos, yPos);
                }
            
                allDesks.forEach((singleDesk) => {
                    var differenceX = e.nativeEvent.offsetX - singleDesk.coordinates[0];
                    var differenceY = e.nativeEvent.offsetY - singleDesk.coordinates[1];
                    if (differenceX < 15 && differenceX > -15 && differenceY < 15 && differenceY > -15) {
                        deletion = true;
                        deleteDesk(singleDesk, xPos, yPos);
                    } 
                })
                if (!deletion) {
                    createDesk(xPos, yPos);
                }
                

               
            } else {
                findScale(e);
            }
        }
    }

    const createDesk = (xPos, yPos) => {
        const desk = {
            seat_number: allDesks.length +  1,
            available: true,
            type: 'point',
            coordinates: [
                xPos,
                yPos
            ],
            pix_coordinates: [
                xPos,
                yPos
            ]
        }

        addDesk(allDesks.concat(desk)); // adds the desk to the allDesks array in the state
    }

    const deleteDesk = (desk, xPos, yPos) => {
        for (var i = 0; i < allDesks.length;i++) {
            if (desk === allDesks[i]) {
                allDesks.splice(i, 1);
                break;
            }
        }

        for (var j = 0; j < allDesks.length; j++) {
            allDesks[j].seat_number = j + 1;
        }

        var input = document.getElementById("confirm-deletion");
        input.style = {display: 'block'}
    }

    const auxDelete = () => {
        causeForceUpdate(forceUpdate + 1);
        var input = document.getElementById("confirm-deletion");
        input.style.visibility = "hidden";
    }

    const findScale = (e) => {
        var input = document.getElementById("wrap-inputPx");
        input.style = {display: 'block'}
        var input2 = document.getElementById("wrap-inputFt");
        input2.style = {display: 'block'}
        var input3 = document.getElementById("wrap-inputM");
        input3.style = {display: 'block'}

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
        setUsingFeet(true);
    }

    const auxMeters = (e) => {
        var input = document.getElementById("inputM");
        setMeterValue(input.value);
        setUsingMeters(true);
    }
   
    return (
        <div id="wrapper" style={wrapperStyle} >
            <div id="header1"></div>
            <div id="header2"></div>
            <div id="header3"></div>
            
            <canvas id="canvas" ref={canvasRef} width={500} height={500} style={canvasStyle} onClick={markDesk}></canvas>
            <div id="wrap-inputPx" style={{display: 'none'}}>
                <label htmlFor="inputPx">Adjust size of the scale line: </label>
                <input id="inputPx" onChange={auxScale} type="number" min="1" placeholder="1" style={inputStyle} ></input>
            </div>
            <div id="wrap-inputFt" style={{display: 'none'}}>
                <label htmlFor="inputFt">How many feet does this correspond to? </label>
                <input id="inputFt" onChange={auxFeet} type="number" min="1" placeholder="1" style={inputStyle} ></input>
            </div>
            <div id="wrap-inputM" style={{display: 'none'}}>
                <label htmlFor="inputM"> Or how many meters does this correspond to? </label>
                <input id="inputM" onChange={auxMeters} type="number" min="1" placeholder="1" style={inputStyle} ></input>
            </div>
            <div id="confirm-deletion" style={{display: 'none'}}>
                <input id="delete-btn" type="submit" value="Confirm Deletion" style={uploadStyle} onMouseUp={auxDelete}></input>
            </div>
            <input id="handle-btn" onClick={onSubmit} type="submit" value={buttonText} style={uploadStyle}/>
        </div>
    )
}

const wrapperStyle = {
    textAlign: 'center',
    marginTop: '20px'
}

const canvasStyle = {
    paddingLeft: '0',
    paddingRight: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10px',
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

const inputStyle = {
    width: '50px',
    marginLeft: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingRight: '-10px',
    paddingLeft: '20px',
    background: '#eee',
    fontSize: '14px',
    border: 'none',
    borderColor: 'black',
    borderWidth: '1px',
}

HandleFloorPlan.propTypes = {
    imageSrc: PropTypes.string,
    imgFile: PropTypes.any
}

export default HandleFloorPlan;
