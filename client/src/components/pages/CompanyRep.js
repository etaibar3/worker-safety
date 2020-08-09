// Component: CompanyRep
// Description: This is page where employees can identify their company rep

import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router'

class CompanyRep extends React.Component {
    constructor() {
        super()
        this.state = {
            adminEmail: null,
            redirect: false
        }
        this.initialState = this.state
    }

    componentDidMount() {
        if (sessionStorage.getItem('loggedIn') === "false" ) {
			console.log("not logged in");
			this.setState({redirect: true});
		} 

        axios
            .get('http://localhost:5000/employee/companyrep')
            .then(response => {
                console.log(response)
                this.setState({ adminEmail: response.data.rep })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const { adminEmail, redirect } = this.state

        if (redirect) {
			return <Redirect to = {{ pathname: "/login" }} />
		}

        return (
            <div>
                <h3> Please direct any questions or concerns towards your company
                     representative. You can email your company representative at <strong> {adminEmail}</strong>. </h3>
                {/*<a href="mailto:`${this.state.adminEmail}`"> Email yourself </a>*/} 
            </div>
        )
    }
}

export default CompanyRep
