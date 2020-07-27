// The page for uploading the floor plan
// Passes the image source to the HandleFloorPlan component where
// the image is rendered and desks are marked

import React, { useState } from 'react';
import HandleFloorPlan from '../functionality/HandleFloorPlan'
import axios from 'axios';

export const UploadFloorPlan = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [imgSrc, setImg] = useState('');
    
    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);

        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onloadend = function (e) {
            setImg(reader.result); // imgSrc set here
        };
    };

    const onSubmit = /*async*/ e => {
        e.preventDefault();
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.set('name', 'test123');
        // console.log(file);
        
        // const fileObj = {
        //     'name': filename,
        //     'floorplanImage': file
        // }

        // console.log(file);

        // axios.post(`http://localhost:5000/floorplan/`, { 'name': filename, 'file': file })
        //     .then(res => {
        //         console.log(res);
        //     });
    };

    return (
        <div>
            <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="custom-file wrapper" style={wrapperStyle}>
                    <label style={fileStyle} htmlFor="file-upload"> {filename}
                    </label>
                    <input id="file-upload" type="file" style={hide} onChange={onChange}/>
                    <HandleFloorPlan imageSrc={imgSrc} imgFile={file}/>  
                </div>
            </form>       
        </div>
    )
}

const wrapperStyle = {
    display: 'grid'
}

const hide = {
    display: 'none'
}

const fileStyle = {
    padding: '10px',
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '20px',
    marginBottom: '10px',
    background: '#eee',
    fontSize: '16px',
    border: 'solid',
    borderColor: 'black',
    borderWidth: '1px',
    borderRadius: '25px'
}



export default UploadFloorPlan;