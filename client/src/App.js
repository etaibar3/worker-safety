//Must npm i react-router-dom

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/header';
import NavBar from './components/layout/navbar';
import LearnMore from './components/pages/LearnMore';
import KnowYourRights from './components/pages/KnowYourRights';
import Home from './components/layout/home';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Header />
          <NavBar />
          {/* <Home /> */}
          <Route exact path="/" component={Home}/>
          <Route exact path="/learn-more" component={LearnMore}/>
          <Route exact path="/know-your-rights" component={KnowYourRights}/>
        </div>
      </div>
    </Router>
  );
}

export default App;
