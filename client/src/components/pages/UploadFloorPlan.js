// The page for uploading the floor plan
// Passes the image source to the HandleFloorPlan component where
// the image is rendered and desks are marked
import React, { useState } from 'react';
import HandleFloorPlan from '../functionality/HandleFloorPlan'
import axios from 'axios';

export const UploadFloorPlan = () => {
    const [file, setFile] = useState('');
    const [imgSrc, setImg] = useState('');
    const [filename, setFilename] = useState('Choose File');
    // const [fileURL, setFileUrl] = useState('');
    // const [uploadedFile, setUploadedFile] = useState({});

    const onChange = (e) => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);

        var reader = new FileReader();
        var url = reader.readAsDataURL(e.target.files[0]);

        reader.onloadend = function (e) {
            setImg(reader.result);
        }.bind(this);
    };

// I will need to create an object with a field: name, and file.path
// async vs sync

    const onSubmit = /*async*/ e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        // formData.set('name', 'test123');
        // console.log(file);
        
        const fileObj = {
            name: filename,
            floorplanImage: file
        }

        console.log(fileObj);

        try {
            axios.post('http://localhost:5000/floorplan/', { fileObj })
                .then(res => {
                    console.log(res);
                });

            // const res = await axios.post('http://localhost:5000/floorplan/', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });
            // const { fileName, filePath } = res.data;
            // setUploadedFile({ fileName, filePath });
        } catch(err) {
            if(err.response.status === 500) {
                console.log('There was a problem with the server');
            } else {
                console.log(err.response.data.msg);
            }
        }

    };

    return (
        <div>
            <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="custom-file wrapper" style={wrapperStyle}>
                    <label style={uploadStyle} htmlFor="file-upload"> {filename}
                    </label>
                    <input id="file-upload" type="file" style={hide} onChange={onChange}/>
                    <HandleFloorPlan imageSrc={imgSrc}/>
                </div>
                <input type="submit" value="Upload"/>
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

const uploadStyle = {
    padding: '10px',
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '20px',
    marginBottom: '20px',
    border: 'double',
}

export default UploadFloorPlan;