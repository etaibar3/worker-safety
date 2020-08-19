// Component: AddUser
// Description: Functionality for adding a user to the company roster


import React from 'react'
import axios from 'axios'
import { withAlert } from 'react-alert';
import { Redirect } from 'react-router';


class AddUser extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            status: 400,
            permissions: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.routeChangeCancel = this.routeChangeCancel.bind(this)       
    }

    handleChange(event) {
        const {name, value} = event.target
        this.setState({ [name] : value })
    }


    routeChangeCancel() {
        let path = `/roster`;
        this.props.history.push(path);
    }

    handleSubmit(event) {
        event.preventDefault()
        let isAdmin = false
        if (this.state.permissions === "admin") {
            isAdmin = true
        }
        axios
            .post(`/org/manageRoster`, { 'email': this.state.email, 'admin': isAdmin})
            .then(response => {
                console.log(response)
                this.props.alert.success('Success')
                this.setState({
                    status: response.status
                })
            })
            .catch(error => {
                console.log(error)
                this.props.alert.error(error.response.data.error)
            })
    }

    render () {
        return (
            <div>
            <h1> Add User </h1>
            <br/>
            <p> To add a new user to your team, fill in their email address and user type,
            and we'll send them a registration link! </p>
            <br/>
            <form onSubmit={this.handleSubmit}>
                <label className="text-style"> 
                    <strong> New User's Email Address </strong>
                    <br />
                    <input 
                        type="email"
                        name="email"
                        style={inputBox}
                        value={this.state.email}
                        placeholder="Enter email address" 
                        onChange={this.handleChange}
                    />
                </label>
                <br/><br/>
                <strong> User Type </strong>
                <br/><br />
                {(this.state.permissions === "employee") ? 
                    <div>
                        <label style={radioContainerSelected}>
                            <input 
                                type="radio" 
                                name="permissions"
                                value="employee"
                                checked={this.state.permissions === "employee"}
                                onChange={this.handleChange}
                                /> <strong> Employee </strong>
                        </label>
                        <br />
                        <label style={radioContainerDefault}>
                            <input 
                                type="radio" 
                                name="permissions"
                                value="admin"
                                checked={this.state.permissions === "admin"}
                                onChange={this.handleChange}
                                /> <strong> Admin </strong>
                        </label>
                    </div>
                    : null }

                {(this.state.permissions === "admin") ? 
                    <div>
                        <label style={radioContainerDefault} >
                            <input 
                                type="radio" 
                                name="permissions"
                                value="employee"
                                checked={this.state.permissions === "employee"}
                                onChange={this.handleChange}
                                /> <strong> Employee </strong>
                        </label>
                        <br />
                        <label style={radioContainerSelected}>
                            <input 
                                type="radio" 
                                name="permissions"
                                value="admin"
                                checked={this.state.permissions === "admin"}
                                onChange={this.handleChange}
                                /> <strong> Admin </strong>
                        </label>
                    </div>
                    : null }

                {(this.state.permissions === "") ? 
                    <div>
                        <label style={radioContainerDefault} >
                            <input 
                                type="radio" 
                                name="permissions"
                                value="employee"
                                checked={this.state.permissions === "employee"}
                                onChange={this.handleChange}
                                /> <strong> Employee </strong>
                        </label>
                        <br />
                        <label style={radioContainerDefault}>
                            <input 
                                type="radio" 
                                name="permissions"
                                value="admin"
                                checked={this.state.permissions === "admin"}
                                onChange={this.handleChange}
                                /> <strong> Admin </strong>
                        </label>
                    </div>
                    : null }

                <br/><br/><br/>

                {(this.state.permissions === "" || this.state.email === "") ?
                    <div>
                        <button style={cancelStyle} onClick={this.routeChangeCancel}>Cancel</button>
                        <button type="button" style={submitButtonInactive}>Send Link</button>
                    </div>
                    :
                    <div>
                        <button style={cancelStyle} onClick={this.routeChangeCancel}>Cancel</button>
                        <button type="submit" style={submitButtonActive} onSubmit={this.handleSubmit}>Send Link</button>
                    </div>
                }
                {(this.state.status === 200) ? 
                    <Redirect to = {{ pathname: "/roster" }} /> : null}
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
  borderRadius: 5,
  backgroundColor: "#ffffff",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#c4c4c4"
};

const submitButtonInactive = {
  width: 131,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#c4c4c4",
  color:"#ffffff"
};

const cancelStyle = {
  width: 113,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#ffffff",
  color: "#2121ca"
};

export default withAlert()(AddUser)
