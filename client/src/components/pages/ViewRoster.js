import React from 'react'
import axios from 'axios'
import { withAlert } from 'react-alert';
import './Roster.css'
import Modal from 'react-modal';


class ViewRoster extends React.Component {
    constructor() {
        super()
        this.state = {
            admins: [],      //array of admin user with email and name field for view roster
            employees: [],
            permissions: "",
            show: null
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.openModal = this.openModal.bind(this)
        //this.editUser = this.editUser.bind(this)
    }

    componentDidMount() {
        {/* user.name is empty string post invite and pre account creation */ }
        const { admins, employees } = this.state
        axios
            .get(`http://localhost:5000/org/manageRoster`)
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

    openModal() {
        this.setState({
            show: true
        })
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

    handleSubmit(event) {
        event.preventDefault()
        alert(event)
    }

    render() {
        const { admins, employees, show } = this.state
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
                                            <button onClick={this.openModal} style={EditButtonStyle}> Edit</button>
                                            {(show) ?
                                            <div>
                                                <Modal 
                                                    isOpen={show} 
                                                    onRequestClose={() => this.handleClose()}
                                                    style = {modalStyle}
                                                    >
                                                    <button onClick={this.handleClose} style={EditButtonStyle}> X </button>
                                                    <h2 align="center"> Change User Type </h2>
                                                    <form onSubmit={this.handleSubmit}>
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
                                                        <label style={radioContainerSelected}>
                                                            <input 
                                                                type="radio" 
                                                                name="permissions"
                                                                value="admin"
                                                                checked={this.state.permissions === "admin"}
                                                                onChange={this.handleChange}
                                                                /> <strong> Admin </strong>
                                                        </label>
                                                        <br/><br/>
                                                        <button type="submit">Submit</button>
                                                    </form>
                                                </Modal> 
                                            </div> : null}
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

const modalStyle = {
    overlay: {
      position: 'fixed',
      top: "20%",
      left: "20%",
      right: "20%",
      bottom: "20%",
      backgroundColor: '#ECEFFF',
      borderRadius: '10px'
    },
    content: {
      position: 'absolute',
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      textAlign: 'center',
      padding: '20px'
    }
};


export default withAlert()(ViewRoster)

/*

                                            <Popup contentStyle={{width: "30%", height: "400px"}} trigger={<button onClick={() => this.editUser(user)} style={EditButtonStyle}> Edit</button>
                                            <div>
                                                <h4> Change User Type </h4>
                                                <form onSubmit={this.handleSubmit}>
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
                                                    <label style={radioContainerSelected}>
                                                        <input 
                                                            type="radio" 
                                                            name="permissions"
                                                            value="admin"
                                                            checked={this.state.permissions === "admin"}
                                                            onChange={this.handleChange}
                                                            /> <strong> Admin </strong>
                                                    </label>
                                                    <br/><br/>
                                                    <button type="submit">Submit</button>
                                                </form>
                                            </div>
                                            </Popup>

*/