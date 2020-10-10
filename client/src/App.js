import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/header";
import NavBar from "./components/layout/navbar";
import LearnMore from "./components/pages/LearnMore";
import KnowYourRights from "./components/pages/KnowYourRights";
import CreateRootAccount from "./components/pages/CreateRootAccount";
import CreateChildAccount from "./components/pages/CreateChildAccount";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import RootMenu from "./components/pages/RootMenu";
import Home from "./components/layout/home";
import Roster from "./components/pages/Roster";
import ReserveDate from './components/pages/ReserveDate';
import ReserveSelect from './components/pages/ReserveSelect';
import ReportACase from "./components/pages/ReportACase";
import EmployeeMenu from "./components/pages/EmployeeMenu";
import Reservations from "./components/pages/Reservations";
import CompanyRep from "./components/pages/CompanyRep";
import ResetPassword from "./components/pages/ResetPassword";
import ForgotYourPassword from "./components/pages/ForgotYourPassword";
import AddUser from "./components/pages/AddUser";
import ChangeUser from "./components/pages/ChangeUser";
import FileUpload from "./components/FileUpload";
import axios from 'axios';
import AdminNavBar from "./components/layout/AdminNavBar"
const dotenv = require('dotenv').config(); 

class App extends React.Component {
  componentDidMount(){
    //sessionStorage.setItem('loggedIn', false);
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL =  process.env.REACT_APP_HOST || 'http://localhost:5000/api'
  
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Route exact path="/" component={Home} />
            <Route exact path="/learn-more" component={LearnMore} />
            <Route exact path="/know-your-rights" component={KnowYourRights} />
            <Route exact path="/create-root-account" component={CreateRootAccount} />
            <Route exact path="/create-child-account" component={CreateChildAccount} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/root-menu" component={RootMenu} />
            <Route exact path="/roster" component={Roster} />
            <Route exact path="/reserve-date" component={ReserveDate}/>
            <Route exact path="/reserve-select" component={ReserveSelect}/>
            <Route exact path="/employee-menu" component={EmployeeMenu} />
            <Route exact path="/reservations" component={Reservations} />
            <Route exact path="/report-a-case" component={ReportACase} />
            <Route exact path="/company-rep" component={CompanyRep} />
            <Route exact path="/resetpassword/:token" component={ResetPassword} />
            <Route exact path="/forgotyourpassword" component={ForgotYourPassword} />
            <Route exact path="/upload-floor-plan" component={FileUpload} />
            <Route exact path="/add-user" component={AddUser} />
            <Route exact path="/change-user" component={ChangeUser} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
