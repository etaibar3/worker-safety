// Component: Roster
// Description: This component contains roster interactions.


import React from 'react'
import axios from 'axios'
import ViewRoster from './ViewRoster';
import { withAlert } from 'react-alert';
import { Redirect } from 'react-router';
import AddUser from './AddUser';

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
        this.addRoute = this.addRoute.bind(this)
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

    addRoute() {
        this.setState({
            method: "Add"
        })
    }

    searchUser(email) {
        this.setState({ name: "" })
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
        return false
    }

    handleSubmit(event) {
        event.preventDefault()
        if (this.state.method === "Change type") {
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
                        <option value="Change type">Change user account type</option>
                    </select>
                    <br/><br/>

                    <button type="button" style={submitButtonActive} onClick={this.addRoute}>Add User</button>
                    {(method === "Add") ? <Redirect to = {{ pathname: "/add-user" }} /> : null}

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
                    {(method !== " " & method !== "View" & method != "Add") ? <button type="submit" style={submitButtonActive} onSubmit={this.handleSubmit}>Submit</button> : null}
                    <br/><br/>

                    <label className="text-style">
                        <input 
                            type="email"
                            name="email"
                            style={inputBox}
                            value={email}
                            placeholder="Search by email..." 
                            onChange={this.handleChange}
                        />
                    {"   "}
                    {(email != "") ? <button type="submit" style={searchButton} onClick={() => this.searchUser(email)}>Search</button> : null}
                    </label>
                    <br/> <br/>
                    {/* Display response from database */}
                    {(submitClicked && status !== 200) ? <div> <p> {email} is not currently on your company roster. </p> <p>You can add them through the "Add a user" option above.</p> </div>: null }
                    {(submitClicked && status === 200 && name !== "") ? 
                        <p> {name}, {email}, is on your roster. {(isAdmin) ? <p>Account type: Administrator </p> : <p> Account type: Employee </p>} </p> : null }
                    {(submitClicked && status === 200 && name === "") ? 
                        <p> {email} is on your roster but has not created an account yet. {(isAdmin) ? <p>Account type: Administrator </p> : <p> Account type: Employee </p>} </p> : null }
                </form>
                <ViewRoster /> 
                <br/><br/>
            </div>
        )
    }
}


const submitButtonActive = {
  width: 131,
  height: 59,
  borderRadius: 5,
  fontWeight: "500",
  backgroundColor: "#2121ca",
  color:"#ffffff"
};

const searchButton = {
  width: 70,
  height: 40,
  borderRadius: 3,
  fontWeight: "200",
  backgroundColor: "#F0F0F0",
  color:"#000000",
};

const inputBox = {
  width: 200,
  height: 40,
  padding: 8,
  borderRadius: 5,
  backgroundColor: "#ffffff",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#c4c4c4"
};

export default withAlert()(Roster)
