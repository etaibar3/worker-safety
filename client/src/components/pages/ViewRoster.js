import React from 'react'
import axios from 'axios'
import './Roster.css'

class ViewRoster extends React.Component {
    constructor() {
        super()
        this.state = {
            admins: [],      //array of admin user with email and name field for view roster
            employees: []
        }
        this.initialState = this.state
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

    render() {
        const { admins, employees } = this.state
        return (
            <div>
                { (admins.length > 0 || employees.length > 0) ? 
                    <div>
                        <table align="center" >
                        	<thead>
                                <tr>
                                    <th> Name </th>
                                    <th> Email </th>
                                    <th> Account Type </th>
                                </tr>
                        	</thead>
                        	<tbody>
                                {admins.map(user => (
                                    <tr key={user.email} align="center">
                                        <td key={user.name}> 
                                            {(user.name === "" || user.name === " ") ? <p> User has not yet created their account. </p>: user.name}
                                        </td>
                                        <td key={user.email}>
                                            {user.email}
                                        </td>
                                        <td key={user.index}>
                                            Administrator
                                        </td>
                                    </tr>
                                ))}
                                {employees.map(user => (
                                    <tr key={user.email} align="center">
                                        <td key={user.name}>
                                            {(user.name === "" || user.name === " ") ? <p> User has not yet created their account. </p>: user.name}
                                        </td>
                                        <td key={user.email}>
                                            {user.email}
                                        </td>
                                        <td key={user.index}>
                                            Employee
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

export default ViewRoster
