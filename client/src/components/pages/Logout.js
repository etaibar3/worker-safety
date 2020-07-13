import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class Logout extends React.Component {
    constructor() {
        super()
        this.state = {
            status: 400,
        }
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        axios
            .post(`http://localhost:5000/login`, { 'email': this.state.email, 'password': this.state.password })
            .then(response => {
                axios.defaults.headers.common['auth'] = response.data
                console.log(response)
                this.setState({ 
                    status: response.status 
                })
            })
            .catch(error => {
                console.log(error)
            })          
    }

    render() {
        const { status } = this.state
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <button type="submit">Logout </button>
                </form>
            </div>
        )
    }
}

export default Logout;
