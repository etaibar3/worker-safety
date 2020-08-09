import React, { Fragment, useState, useEffect } from 'react'
import Message from './Message'
import Progress from "./Progress"
import HandleFloorPlan from './functionality/HandleFloorPlan'
import axios from "axios"
import { Redirect } from 'react-router'

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [imgSrc, setImg] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('loggedIn') === "false" ) {
			console.log("not logged in");
			setRedirect(true);
		} 
  })

  const onChange = (e) => {
    var input = document.getElementById('upload-btn');
    input.style.visibility = "visible";
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);

    var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = function (e) {
      setImg(reader.result); // imgSrc set here
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (file != "") {
      const formData = new FormData();
      formData.append("name", filename);
      formData.append("floorplanImage", file);
  
      try {
        const res = await axios.post(`http://localhost:5000/upload/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
  
            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);
          },
        });
  
        const { fileName, filePath } = res.data;
  
        setUploadedFile({ fileName, filePath });
  
        setMessage("File Uploaded");
      } catch (err) {
        if (err.response.status === 500) {
          setMessage("There was a problem with the server");
        } else {
          setMessage(err.response.data.msg);
        }
      }
    }
  };

  if (redirect) {
    return <Redirect to = {{ pathname: "/login" }} />
  }

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}

      <form
        action="fileupload"
        method="POST"
        onSubmit={onSubmit}
        enctype="multipart/form-data"
      >

      <form onSubmit={onSubmit} style={formStyle} >

        <div className="custom-file mb-4">
          <h2>Create your floor plan</h2>
          <label htmlFor="customFile" style={fileStyle} htmlFor="customFile">
            {filename}
          </label>
          <input
            type="file"
            name="floorplanImage"
            class="form-control"
            id="customFile"
            style={{display: 'none'}}
            onChange={onChange}
          />
          
          <HandleFloorPlan imageSrc={imgSrc} imgFile={file}/>  
        </div>

        {/* <Progress percentage={uploadPercentage} /> */}

        <input
          id="upload-btn"
          type="submit"
          value="Upload"
          // className="btn btn-primary btn-block mt-4"
          style={uploadStyle}
        />
      </form>
      </form>
      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

const formStyle ={
  paddingTop: '20px'
}

const fileStyle = {
  marginTop: '20px',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '75px',
  paddingRight: '75px',
  background: '#eee',
  fontSize: '16px',
  border: 'solid',
  borderColor: 'black',
  borderWidth: '1px',
  borderRadius: '25px'
}

const uploadStyle = {
  visibility: 'hidden',
  marginTop: '20px',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '75px',
  paddingRight: '75px',
  background: '#eee',
  fontSize: '16px',
  border: 'solid',
  borderColor: 'black',
  borderWidth: '1px',
  borderRadius: '25px'
}

export default FileUpload;
