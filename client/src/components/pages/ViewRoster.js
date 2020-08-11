import React from 'react'
import axios from 'axios'
import { withAlert } from 'react-alert';
import './Roster.css'

class ViewRoster extends React.Component {
    constructor() {
        super()
        this.state = {
            admins: [],      //array of admin user with email and name field for view roster
            employees: [],
        }
        this.initialState = this.state
    }

    componentDidMount() {
        {/* user.name is empty string post invite and pre account creation */ }
        const { admins, employees } = this.state
        axios
            .get(`http://localhost:5000/org/manageRoster`, {withCredentials: true})
            .then(response => {
            	console.log(response)
                response.data.admins.map((a_email, index) => {
                	const newAdmin = {
                		email: a_email,
                        name: response.data.aNames[index] 
                	};
	                admins.push(newAdmin)
                })
                this.setState({
                	admins: this.state.admins
                })

                response.data.employees.map((e_email, index) => {
                    const newEmployee = {
                        email: e_email,
                        name: response.data.eNames[index]
                    };
                	employees.push(newEmployee)
                })
                this.setState({
                	employees: this.state.employees
                })
            })
    }

    editUser(event) {
        {/* Set user account type to admin or employee 
        //create popup here to select admin or employee
        let admin
        {(this.state.permissions === "administrator") ? admin = true : admin = false}
        axios
         .patch(`http://localhost:5000/org/manageRoster`, { 'email': this.state.email, 'admin': admin })
         .then(response => {
             console.log(response)
             this.props.alert.success('Success')
         })
         .catch(error => {
             console.log(error)
             this.props.alert.error(error.response.data.error)
         })*/}
    }

    removeUser(event) {
        {/* Delete user from company roster */}
        axios
            .delete(`http://localhost:5000/org/manageRoster`, {data: {email: event.email } })
            .then(response => {
                console.log(response)
                this.props.alert.success('Success')
            })
            .catch(error => {
                console.log(error)
                this.props.alert.error(error.response.data.error)
            })
    }

    render() {
        const { admins, employees, editClicked } = this.state
        return (
            <div>
                { (admins.length > 0 || employees.length > 0) ? 
                    <div>
                        <table align="center" >
                        	<thead>
                                <tr>
                                    <th> Name </th>
                                    <th/>
                                    <th> Email </th>
                                    <th/>
                                    <th/>
                                </tr>
                        	</thead>
                        	<tbody>
                                {admins.map(user => (
                                    <tr key={user.email} align="center">
                                        <td key={user.name}> 
                                            {(user.name === "" || user.name === " ") ? <p> User has not yet created their account. </p>: user.name}
                                        </td>
                                        <td key={user.index} style={adminStyle} text-align="left">
                                            ADMIN
                                        </td>
                                        <td key={user.email}>
                                            {user.email}
                                        </td>
                                        <td>
                                            <button onClick={() => this.removeUser(user)} style={EditButtonStyle}>Remove </button>
                                        </td>
                                        <td>
                                            <button onClick={() => this.editUser(user)} style={EditButtonStyle}> Edit </button>
                                        </td>
                                    </tr>
                                ))}
                                {employees.map(user => (
                                    <tr key={user.email} align="center">
                                        <td key={user.name}>
                                            {(user.name === "" || user.name === " ") ? <p> User has not yet created their account. </p>: user.name}
                                        </td>
                                        <td key={user.index}> 
                                        </td>
                                        <td key={user.email}>
                                            {user.email}
                                        </td>
                                        <td>
                                            <button onClick={() => this.removeUser(user)} style={EditButtonStyle}>Remove </button>
                                        </td>
                                        <td>
                                            <button onClick={() => this.editUser(user)} style={EditButtonStyle}> Edit </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 : <p> You cannot currently view your organization's roster. Make sure you are logged in. </p>}
            </div>
        )
    }
}

const adminStyle = {
  width: 45,
  height: 17,
  fontFamily: "Rubik",
  fontSize: 14,
  fontWeight: "500",
  fontStyle: "normal",
  letterSpacing: 0,
  color: "#2121ca"
};

const EditButtonStyle = {
    textAlign: 'center',
    color: "#2121ca",
    fontWeight: "350",
};

export default withAlert()(ViewRoster)



/*                                            {(editClicked === user.index) ?
                                                <div>
                                                    <button onClick={() => this.editUser(user)} style={EditButtonStyle}>Remove </button>
                                                    {" "}
                                                    <button onClick={() => this.editUser(user)} style={EditButtonStyle}>Change User Type </button>
                                                </div>
                                            :
                                                <button onClick={() => this.editUser(user)} style={EditButtonStyle}> Edit </button>
                                            }*/