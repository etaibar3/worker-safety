// component for the Learn More (FAQ) page

import React from 'react';
import { Link } from 'react-router-dom';

function LearnMore() {

  return (
      <div className="container" style={containerStyle}>
        <h1 style={headerStyle}>Learn More</h1>
        <ul className="faqs" style={listStyle}>
          <li style={questionStyle}>What does your service provide?</li>
          <li style={answerStyle}>Safe Return gives your company a service to open your office spaces in an organized and safe manner to help it succed in a world wherre health and safety is imperative.</li>
          <li style={questionStyle}>Who created Safe Return?</li>
          <li style={answerStyle}>Safe Return was created in the summer of 2020, by 6 Tufts students who recognized the challenges companies would face while getting their workers to return to the office after the COVID-19 pandemic.</li>
          <li style={questionStyle}>How do I use Safe Return?</li>
          <li style={answerStyle}>Safe Return can be used by any company looking to bring employees back in a safe and socially distanced way. Get started by creating an administrative account and inviting other employees to join. Learn more at our<Link style={linkStyle} to="/create-root-account"> get started</Link> page</li>
        </ul>
      </div>
  )
}

const containerStyle = {
  display: 'grid'
}

const headerStyle = {
  margin: '20px',
  marginBottom: '10px'
}

const listStyle = {
  display: 'grid',
  listStyleType: 'none',
  textAlign: 'left',
  padding: '5px',
  marginTop: '5px',
  marginBottom: '5px',
  marginRight: '7%',
  marginLeft: '7%'
}

const questionStyle = {
  background: '#d9d9d9',
  padding: '10px',
  fontWeight: 'bold'
}

const answerStyle = {
  background: '#f2f2f2',
  padding: '10px',
  fontStyle: 'italic',
  textIndent: '20px'
}

const linkStyle = { 
  color: 'black'
}

export default LearnMore;