import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return(
        <div class="wrapper" style={wrapperStyle}>
            <Link style={tileStyle}>
                <h2>Get Started</h2>
                <p>Worker safety is our top priority. Our service allows 
                    companies to track and manage desk reservations as 
                    employees return to the office after the COVID-19 
                    pandemic. If you are an employee at a company that is already
                    using Safe Return, please ask your company administrator to 
                    add you to the company roster. If you are a company representative and
                    would like to sign your company up for Safe Return, you can get started 
                    {" "}
                    <Link to='/create-root-account'><strong>here.</strong> </Link>
                </p> 
            </Link>
            <div class="wrapper2" style={row2Style}>
                <Link to="/learn-more" style={tileStyle}>
                    <h3>About Us</h3>
                    <p>Created in the summer of 2020, this website is the 
                        work of 6 Tufts students who recognized the 
                        challenges companies would face while getting their 
                        workers to return to the office after the COVID-19 
                        pandemic...
                    </p>
                </Link>
                <Link to="/learn-more" style={tileStyle}>
                    <h3>Learn More</h3>
                    <p>Check our page of frequently asked questions to
                        understand our service more and how we can help
                        your company return to the office in a safe
                        manner.
                    </p>
                </Link>
                <Link to="know-your-rights" style={tileStyle}>
                    <h3>Know Your Rights</h3>
                    <p>Worried that your rights as a worker are being 
                        violated or that your company is not taking
                        the threat of COVID-19 seriously? Visit our
                        know your rights page in order to learn more.
                    </p>
                </Link>
            </div>
        </div>
    )
}

const wrapperStyle = {
    display: 'grid',
}

const row2Style = {
    display: 'grid',
    gridTemplateColumns: '33% 33% 33%'
}

const tileStyle = {
    background: '#eee',
    color: 'black',
    padding: '10px',
    margin: '10px',
    textDecoration: 'none'
}

export default Home;