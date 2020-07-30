import React from 'react';
import ReactDOM from 'react-dom';
import './assets/main.css'
import App from './App';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

/* Settings for error alerts*/
const options = {
  position: positions.TOP_CENTER,
  timeout: 7000,
  offset: '30px',
  transition: transitions.SCALE
}

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
     <App />
     </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

