// Component: CompanyRep
// Description: This is page where employees can identify their company rep

import React from 'react'
import axios from 'axios'

class CompanyRep extends React.Component {
    constructor() {
        super()
        this.state = {
            adminEmail: null
        }
        this.initialState = this.state
    }

    componentDidMount() {
        axios
            .get(`<URL>`)
            .then(response => {
            	console.log(response)
            	this.setState({ adminEmail: "FILL THIS IN" })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const { adminEmail } = this.state
        return (
            <div>
                <h3> Please direct any questions or concerns towards your company
                	 representative. You can email your company representative at <strong> {adminEmail} </strong>. </h3>
                {/*<a href="mailto:`${this.state.adminEmail}`"> Email yourself </a>*/} 
            </div>
        )
    }
}

export default CompanyRep
