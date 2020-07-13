import React from 'react'
import axios from 'axios'
import './Roster.css'

class ViewRoster extends React.Component {
    constructor() {
        super()
        this.state = {
            admins: [],      //array of admin emails for view roster
            employees: [],
        }
        this.initialState = this.state
    }

    componentDidMount() {
        const { admins, employees } = this.state
        axios
            .get(`http://localhost:5000/org/manageRoster`)
            .then(response => {
            	console.log(response)
                response.data.admins.map((a_email, index) => {
                	const newAdmin = {
                		email: a_email
                	};
	                admins.push(newAdmin)
                })
                this.setState({
                	admins: this.state.admins
                })

                response.data.employees.map((e_email, index) => {
                    const newEmployee = {
                        email: e_email,
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
                        <table align="center">
                        	<thead>
                                <tr>
                                    <th> Email </th>
                                    <th> Account Type </th>
                                </tr>
                        	</thead>
                        	<tbody>
                                {admins.map(user => (
                                    <tr key={user.email} align="center">
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
