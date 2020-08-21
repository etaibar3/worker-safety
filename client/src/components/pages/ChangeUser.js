import React from 'react'
import axios from 'axios'
import { withAlert } from 'react-alert';
import { Redirect } from 'react-router';


class ChangeUser extends React.Component {
	constructor(props) {
        super(props)
        this.state = {
            email: null,
            status: 400,
            permissions: "",
            redirect: false,
            currType: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.routeChangeCancel = this.routeChangeCancel.bind(this)       
    }

    componentDidMount(props) {
        if (sessionStorage.getItem('loggedIn') === "false" ) {
            console.log("not logged in");
            this.setState({redirect: true});
        }
        this.setState({
        	email: this.props.location.state.email,
        	permissions: this.props.location.state.currType,
        	currType: this.props.location.state.currType
        })
    }

    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState ({ [name]: checked }) : this.setState({ [name] : value })
    }


    routeChangeCancel() {
        let path = `/roster`;
        this.props.history.push(path);
    }

    handleSubmit(event) {
    	{/* Set user account type to admin or employee*/} 
        event.preventDefault()
        const { permissions, email } = this.state
        //alert(`${permissions} and ${email}`)
        let admin
        {(permissions === "admin") ? admin = true : admin = false}
        axios
         .patch(`http://localhost:5000/org/manageRoster`, { 'email': email, 'admin': admin })
         .then(response => {
             console.log(response)
             this.props.alert.success('Success')
         })
         .catch(error => {
             console.log(error)
             this.props.alert.error(error.response.data.error)
         })
    }

    render () {
        const { permissions, email, currType } = this.state
        if (this.state.redirect) {
            return <Redirect to = {{ pathname: "/login" }} />
        }
        return (
		    <div>
		    	<h1> Edit User </h1>
		    	<br />
		    	<p style={textStyle}> You are setting the account type for <strong>{email}</strong>.</p>
		    	<p style={textStyle}> <strong>{email}</strong> is currently an <strong>{currType}.</strong> </p>
                <br/><br />
                <form onSubmit={this.handleSubmit}>
					<label className="text-style"> 
						<strong> User's email</strong><br/>
						<input
							style={inputBox}
							type="email" 
							name="email"
							value={email}
						/>
					</label>
                    <br/><br />
                    <strong> Set User Type </strong>
                    <br /><br />
	                {(permissions === "employee") ? 
	                    <div>
	                        <label style={radioContainerSelected}>
	                            <input 
	                                type="radio" 
	                                name="permissions"
	                                value="employee"
	                                checked={permissions === "employee"}
	                                onChange={this.handleChange}
	                                /> <strong> Employee </strong>
	                        </label>
	                        <br />
	                        <label style={radioContainerDefault}>
	                            <input 
	                                type="radio" 
	                                name="permissions"
	                                value="admin"
	                                checked={permissions === "admin"}
	                                onChange={this.handleChange}
	                                /> <strong> Admin </strong>
	                        </label>
	                    </div>
	                    : null }

	                {(permissions === "admin") ? 
	                    <div>
	                        <label style={radioContainerDefault} >
	                            <input 
	                                type="radio" 
	                                name="permissions"
	                                value="employee"
	                                checked={permissions === "employee"}
	                                onChange={this.handleChange}
	                                /> <strong> Employee </strong>
	                        </label>
	                        <br />
	                        <label style={radioContainerSelected}>
	                            <input 
	                                type="radio" 
	                                name="permissions"
	                                value="admin"
	                                checked={permissions === "admin"}
	                                onChange={this.handleChange}
	                                /> <strong> Admin </strong>
	                        </label>
	                    </div>
	                    : null }
	                    <br />
                    <button style={cancelStyle} onClick={this.routeChangeCancel} type="button">Cancel</button>
	                <button type="submit" style={submitButtonActive}>Submit</button>  
	        	</form>
	        </div>
        )
    }
}


const radioContainerSelected = {
  width: 112,
  height: 39,
  lineHeight: 2,
  backgroundColor: "#ECEFFF",
  borderColor: "#2121ca",
  borderWidth: 1,
  borderStyle: "solid",
  borderRadius: 5,
};

const radioContainerDefault = {
  width: 112,
  height: 39,
  lineHeight: 2,
};

const submitButtonActive = {
  width: 131,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#2121ca",
  color:"#ffffff"
};

const inputBox = {
  width: 280,
  height: 59,
  padding: 8,
  borderRadius: 5,
  backgroundColor: "#E8E8E8",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#c4c4c4",
  color: "#606060"
};

const textStyle = {
	color: "#222831",
	textAlign: "left",
	fontSize: 20,
	textAlign: "center"
};

const cancelStyle = {
  width: 113,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#ffffff",
  color: "#2121ca"
};

export default withAlert()(ChangeUser)
