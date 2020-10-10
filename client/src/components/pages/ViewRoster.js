import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { withAlert } from 'react-alert';
import './Roster.css';
import { Link } from 'react-router-dom';
import ChangeUser from './ChangeUser';
import emptyRosterReservations from "../../assets/icons/emptyRosterReservations.PNG";



class ViewRoster extends React.Component {
    constructor() {
        super()
        this.state = {
            admins: [],      //array of admin user with email and name field for view roster
            employees: [],
            permissions: "",
            editRedirect: false,
            email: "",
            currType: ""
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.editEmployee = this.editEmployee.bind(this)
        this.editAdmin = this.editAdmin.bind(this)
    }

    componentDidMount() {
        {/* user.name is empty string post invite and pre account creation */ }
        const { admins, employees } = this.state
        axios
            .get(`/org/manageRoster`, {withCredentials: true})
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

    handleChange(event) {
        this.setState({ submitClicked: false });   
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState ({ [name]: checked }) : this.setState({ [name] : value })
    }

    handleClose() {
        this.setState({
            show: false
        })
    }

    editEmployee(event) {
        this.setState({
            editRedirect: true,
            currType: "employee",
            email: event.email
        })
    }

    editAdmin(event) {
        this.setState({
            editRedirect: true,
            currType: "admin",
            email: event.email
        })
    }

    removeUser(event) {
        {/* Delete user from company roster */}
        axios
            .delete(`/org/manageRoster`, {data: {email: event.email } })
            .then(response => {
                console.log(response)
                this.props.alert.success('Success')
            })
            .catch(error => {
                console.log(error)
                this.props.alert.error(error.response.data.error)
            })
    }

    handleSubmit(event) {
        event.preventDefault()
        alert(event)
    }

    render() {
        const { admins, employees, editRedirect, currType, email } = this.state
        return (
            <div>
            {(this.state.editRedirect) ? 
                <Redirect to={{
                    pathname: '/change-user',
                    state: { 
                        currType: `${currType}`,
                        email: `${email} `
                    }
                }}/>
                :
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
                                            {(user.name === "" || user.name === " ") ? <p> Awaiting user sign up. </p>: user.name}
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
                                            <button onClick={() => this.editAdmin(user)} style={EditButtonStyle}> Edit </button>
                                        </td>
                                    </tr>
                                ))}
                                {employees.map(user => (
                                    <tr key={user.email} align="center">
                                        <td key={user.name}>
                                            {(user.name === "" || user.name === " ") ? <p> Awaiting user sign up. </p>: user.name}
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
                                            <button onClick={() => this.editEmployee(user)} style={EditButtonStyle}> Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 : 
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
                                    <img src={emptyRosterReservations} width="30%" height="30%" /> 
                                    <p> You haven't added any teammates yet! </p>
                                    <br /><br />
                                    <Link to='/add-user' style={addUserStyle}> Add User </Link>
                                    <br /><br /><br /><br />
                                </tbody>
                    </table>
                </div>
                }
                </div> }
            </div>
        )
    }
}

const addUserStyle = {
  width: 113,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#ffffff",
  color: "#2121ca"
};

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

export default withAlert()(ViewRoster)

