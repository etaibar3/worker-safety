//Must npm i react-router-dom

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/header';
import NavBar from './components/layout/navbar';
import LearnMore from './components/pages/LearnMore';
import KnowYourRights from './components/pages/KnowYourRights';
import CreateRootAccount from './components/pages/CreateRootAccount';
import CreateChildAccount from './components/pages/CreateChildAccount';
import Login from './components/pages/Login';
import Home from './components/layout/home';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Header />
          <NavBar />
          <Route exact path="/" component={Home}/>
          <Route exact path="/learn-more" component={LearnMore}/>
          <Route exact path="/know-your-rights" component={KnowYourRights}/>
          <Route exact path="/create-root-account" component={CreateRootAccount}/>
          <Route exact path="/create-child-account" component={CreateChildAccount}/>
          <Route exact path="/login" component={Login}/>
        </div>
      </div>
    </Router>
  );
}

export default App;
