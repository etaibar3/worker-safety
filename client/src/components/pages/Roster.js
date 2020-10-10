// Component: Roster
// Description: This component contains roster interactions.


import React from 'react'
import axios from 'axios'
import ViewRoster from './ViewRoster';
import { withAlert } from 'react-alert';
import { Redirect } from 'react-router';
import AddUser from './AddUser';
import AdminNavBar from "../layout/AdminNavBar"


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
        this.setState({
            submitClicked: true
        })
    }

    render() {
        const { email, method, isAdmin, submitClicked, permissions, status, name, redirect } = this.state
        if (redirect) {
			return <Redirect to = {{ pathname: "/login" }} />
		}
        return (
            <div>
                <br />
                <AdminNavBar />
                <br /><br />
                <h1> Company Roster </h1>
                    <br/><br/>
                    <button type="button" style={submitButtonActive} onClick={this.addRoute}>Add User</button>
                    {(method === "Add") ? <Redirect to = {{ pathname: "/add-user" }} /> : null}
                    <br/><br/><br/>
                    <form onSubmit={this.handleSubmit}>
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
                    </form>
                    <br/> <br/>
                    {/* Display response from database */}
                    {(submitClicked && status !== 200 && email != "") ? <div> <p> {email} is not currently on your company roster. </p> <p>You can add them through the "Add a user" option above.</p> </div>: null }
                    {(submitClicked && status === 200 && name !== "") ? 
                        <p> {name}, {email}, is on your roster. {(isAdmin) ? <p>Account type: Administrator </p> : <p> Account type: Employee </p>} </p> : null }
                    {(submitClicked && status === 200 && name === "") ? 
                        <p> {email} is on your roster but has not created an account yet. {(isAdmin) ? <p>Account type: Administrator </p> : <p> Account type: Employee </p>} </p> : null }
                <br/><br/>
                <ViewRoster /> 
                <br/><br/>
            </div>
        )
    }
}


const submitButtonActive = {
  width: 131,
  height: 50,
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
