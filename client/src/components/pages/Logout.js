import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { withAlert } from 'react-alert';

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
            .delete(`http://localhost:5000/logout`)
            .then(response => {
                axios.defaults.headers.common['auth'] = ''
                console.log(response)
                this.setState({ 
                    status: response.status 
                })
                this.props.alert.success('Logged out')
            })
            .catch(error => {
                console.log(error)
                this.props.alert.error(error.response.data.error)
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

export default withAlert()(Logout);
