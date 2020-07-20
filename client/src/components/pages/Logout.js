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
            .delete(`http://localhost:5000/logout`)
            .then(response => {
                axios.defaults.headers.common['auth'] = ''
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
            {( status === 200 ) ?
                    <Redirect to = {{ pathname: "/login" }} />
                : 
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <button type="submit">Logout </button>
                    </form>
                </div> }
            </div>
        )
    }
}

export default Logout;
