import React from 'react';
// import { Link } from 'react-router-dom';

function KnowYourRights() {
  return (
      <div>
        <h1>Know Your Rights</h1>
        <p style={textStyle}>The passage of the Families First Coronavirus Response Act (FFCRA) has granted employees additional rights during the time of the pandemic. The FFRCA expands access to paid leave due to difficult circumstances caused by COVID-19. These expanded rights include paid sick leave because of quarantine, COVID-19 symptoms, and/or the need to care for a child or individual subject to quarantine. For more information, please visit <a style={aStyle} href="https://www.dol.gov/agencies/whd/pandemic" target="_blank" rel="noopener noreferrer">www.dol.gov/agencies/whd/pandemic</a>. If you are experiencing COVID-19 symptoms, please avoid going to work, remain quarantined, and contact your healthcare provider. If you are experiencing severe symptoms, get emergency care immediately. For the latest Centers for Diesease Control and Prevention (CDC) guidelines, please visit <a style={aStyle} href="https://www.cdc.gov/coronavirus/" target="_blank" rel="noopener noreferrer">www.cdc.gov/coronavirus</a>. </p>
      </div>
  )
}

const textStyle = {
  margin: '20px',
  padding: '20px',
  textAlign: 'left',
  lineHeight: '1.2',
  background: '#f2f2f2'
}

const aStyle = {
  textDecoration: 'underline',
  color: 'black'
}

export default KnowYourRights;