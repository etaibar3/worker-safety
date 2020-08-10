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
    }

    componentDidMount() {
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
        return (
            <div>
            {(this.state.adminEmail === null) ?
                <h3> No company representative found.</h3> 
            :
                <div>
                <h3> You can contact your company representative at {" "}
                <a href={`mailto:${this.state.adminEmail}`} style={mailtoStyle}>{this.state.adminEmail}.</a> </h3>
                </div>
            }
            </div>
        )
    }
}

const mailtoStyle = {
    textDecorationLine: 'underline',
    color: "#2121ca",
};


export default CompanyRep
