// Component: Roster
// Description: This component contains roster interactions.


import React from 'react'
import axios from 'axios'
import ViewRoster from './ViewRoster'
import { withAlert } from 'react-alert'
import { Redirect } from 'react-router'


class Roster extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",       //string--required for all methods
            method: " ",     //string--methods to modify roster: add, remove, lookup, change type
            isAdmin: false,  //bool--only used when adding a user or changing account types
            submitClicked: false,
            permissions: "employee",
            status: 400,
            name: "",
            redirect: false
        }
        this.initialState = this.state
        this.handleChange = this.handleChange.bind(this)
        this.handleMethodChange = this.handleMethodChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
		if (sessionStorage.getItem('loggedIn') === "false" ) {
			console.log("not logged in");
			this.setState({redirect: true});
		} 
	}

    handleChange(event) {
        this.setState({ submitClicked: false });   
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState ({ [name]: checked }) : this.setState({ [name] : value })
    }

    handleMethodChange(event) {
        this.setState(this.initialState)
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState ({ [name]: checked }) : this.setState({ [name] : value })
    }

    handleSubmit(event) {
        event.preventDefault()
        this.setState({ name: "" })
        if (this.state.method === "Add") {
            axios
                .post(`http://localhost:5000/org/manageRoster`, { 'email': this.state.email, 'admin': this.state.isAdmin})
                .then(response => {
                    console.log(response)
                    this.props.alert.success('Success')
                })
                .catch(error => {
                    console.log(error)
                    this.props.alert.error(error.response.data.error)
                })
        }
        else if (this.state.method === "Remove") {
            axios
                .delete(`http://localhost:5000/org/manageRoster`, {data: {email: this.state.email } })
                .then(response => {
                    console.log(response)
                    this.props.alert.success('Success')
                })
                .catch(error => {
                    console.log(error)
                    this.props.alert.error(error.response.data.error)
                })
        }
        else if (this.state.method === "Lookup") {
            this.setState({ submitClicked: true });   {/* Admin clicked submit */}
            axios
             .get('http://localhost:5000/org/manageRoster/' + this.state.email)
             .then(response => {
                console.log(response)
                this.setState({
                    status: response.status,
                    isAdmin: response.data.admin,
                    name: response.data.name
                })
             })
             .catch(error => {
                console.log(error)
                this.setState({
                    status: error.response.status
                })
             })
        }
        else if (this.state.method === "Change type") {
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
             })
        }
        else {
            alert('Error: No roster action selected.')
        }
    }


    render() {
        const { email, method, isAdmin, submitClicked, permissions, status, name, redirect } = this.state
        if (redirect) {
			return <Redirect to = {{ pathname: "/login" }} />
		}
        return (
            <div>
                <h1> Company Roster </h1>
                <p> What would you like to do? </p>
                <form onSubmit={this.handleSubmit} value={method}>
                    <select name="method" onChange={this.handleMethodChange}>
                        <option value=" "> </option>
                        <option value="Add">Add a user</option>
                        <option value="Remove">Remove a user</option>
                        <option value="Lookup">Lookup a user</option>
                        <option value="Change type">Change user account type</option>
                        <option value="View">View roster</option>
                    </select>
                    <br/><br/>

                    {/* To add a user, admin must choose user's account permissions (employee vs admin) */}
                    {(method === "Add") ?
                        <div>
                        <label> 
                            Employee email
                            {" "}
                            <input 
                                type="email"
                                name="email"
                                value={email}
                                placeholder="employee@company.com" 
                                onChange={this.handleChange}
                            />
                        </label>
                        <br/><br/>
                        <h5> Select User Account Type </h5><p style={{ fontSize: "75%"}}> If you
                        choose to add {email} as an administrator, they will
                        be able to perform administrative tasks such as modifying floor plans and updating the company roster.
                        If you are unsure, do not add as an administrator and {email} will be added as a regular employee.
                        </p>
                        <label> 
                            Add as administrator
                            {" "}
                            <input 
                                type="checkbox"
                                name="isAdmin"
                                value="Administrator"
                                checked={isAdmin}
                                onChange={this.handleChange}
                            />
                            <br/>
                        </label>
                        </div>
                    : null}

                    {/*To remove a user, admin must confirm that they want to remove this user*/}
                    {(method === "Remove") ?
                        <div>
                            <label> 
                                Employee email
                                {" "}
                                <input 
                                    type="email"
                                    name="email"
                                    value={email}
                                    placeholder="employee@company.com" 
                                    onChange={this.handleChange}
                                />
                            </label>
                            <br/><br/>
                        </div>
                    : null}

                    {/* To view the company roster, admin just selects "view roster" from drop down*/}
                    {(method === "View") ? <ViewRoster />: null}      

                    {/* To view the company roster, admin must enter user's email*/}
                    {(method === "Lookup") ?
                        <div>
                            <label> 
                                Employee email
                                {" "}
                                <input 
                                    type="email"
                                    name="email"
                                    value={email}
                                    placeholder="employee@company.com" 
                                    onChange={this.handleChange}
                                />
                            </label>
                            <br/> <br/>
                            {/* Display response from database */}
                            {(submitClicked && status !== 200) ? <div> <p> {email} is not currently on your company roster. </p> <p>You can add them through the "Add a user" option above.</p> </div>: null }
                            {(submitClicked && status === 200 && name != "") ? 
                                <p> {name}, {email}, is on your roster. {(isAdmin) ? <p>Account type: Administrator </p> : <p> Account type: Employee </p>} </p> : null }
                            {(submitClicked && status === 200 && name == "") ? 
                                <p> {email} is on your roster but has not created an account yet. {(isAdmin) ? <p>Account type: Administrator </p> : <p> Account type: Employee </p>} </p> : null }
                        </div>
                    : null}

                    {/*To change account type, admin will set it to administrator or employee*/}
                    {(method === "Change type") ?
                        <div>
                            <label> 
                                Employee email
                                {" "}
                                <input 
                                    type="email"
                                    name="email"
                                    value={email}
                                    placeholder="employee@company.com" 
                                    onChange={this.handleChange}
                                />
                            </label>
                            <br/>
                            <p> Set account type to... </p>
                            <label>
                                {" "}
                                <input 
                                    type="radio" 
                                    name="permissions"
                                    value="employee"
                                    checked={permissions === "employee"}
                                    onChange={this.handleChange}
                                    /> Employee
                            </label>
                            <br />
                            <label>
                                {" "}
                                <input 
                                    type="radio" 
                                    name="permissions"
                                    value="administrator"
                                    checked={permissions === "administrator"}
                                    onChange={this.handleChange}
                                    /> Administrator
                            </label>
                            <br/>
                        </div>
                    : null}
                    
                    <br/>
                    {(method !== "View") ? <button type="submit">Submit</button> : null}
                </form>
                <br/>
            </div>
        )
    }
}

export default withAlert()(Roster)
