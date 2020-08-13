const express = require("express");
const router = express.Router();
const {authenticateUser} = require('../middleware/auth')
// const Seat = require("../models/seat");
const User = require('../models/Users.js');
const { Mongoose } = require("mongoose");
var neo4j = require("neo4j-driver");

const driver = neo4j.driver(  "bolt://localhost", neo4j.auth.basic("neo4j", "123456"));

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateEmail(email) {
  let msg = {
      to: email,
      from: 'benjamin.bodine@tufts.edu',
      subject: 'Potential Covid-19 Exposure',
      html:   `
               <h2>Someone in your office has tested positive to Covid-19.</h2>
               <p>You were potentially exposed to this person will in office as well.</p> 
               <p> Please contact your company and follow their quarantine guidlines.</p>
              `
  } 
  return msg;
}

router.post('/', authenticateUser, async function(req, res){
    const session = driver.session();
    const txc = session.beginTransaction()
    var person_name = req.user._id;
    var report_date = req.body.date;
      // Use of Date.now() method 
    try{
        const user = await User.findById(person_name);
        const today = new Date(Date.now());
        //const today = new Date("2020-08-20")
        const reported = new Date(report_date); //this gets 8pm the day before for some reason
        //const result1 = await txc.run( 'Match (a:Users {m_id: $Name}) SET a.COVID19 = true, a.date = date($date) Return a', {Name: person_name, date: report_date})
        //const result1 = await txc.run( 'Match (a:Users {m_id: $Name}) -[:Reserved] -(b:Seat) - [:Within_dist] - (c:Seat)-[:Reserved] - (d:Users) return d', {Name: person_name})
        //const result2 = await txc.run( 'Match (a:Users {m_id: $Name}) -[:Reserved] -(b:Seat) - [:Within_dist] - (c:Seat)-[r:Reserved] - (d:Users) return r', {Name: person_name})
        /* Gets reservations made in org*/
        const result3 = await txc.run( 'Match (a:Users) -[r:Reserved] -(b:Seat {org: $org}) return r', {org: req.user.org})
        /* Gets who made the reservations*/
        const result4 = await txc.run( 'Match (a:Users) -[r:Reserved] -(b:Seat {org: $org}) return a', {org: req.user.org})
        /* Gets the reservations the sick user made*/
        const result5 = await txc.run( 'Match (a:Users {m_id: $Name}) -[r:Reserved] -(b:Seat) return r', {Name: person_name})
        //const result3 = await txc.run( 'Match (a:Users {m_id: $Name}) -[:Reserved] -(b:Seat) -[:Reserved] - (d:Users) return d ', {Name: person_name})
        //const result4 = await txc.run('Match (n:Users {m_id: $Name}) return n', {Name: person_name})
        var exposed_persons = [];
        var index = 0;
      
        /* Gets the dates covid person was in office*/
        const covid_dates = result5.records.map(record => {
           const date = new Date(record._fields[0].properties.time)
           return date.getTime()
        })

        /* Gets all people who made reservation same day as covid person*/
        for (const record of result3.records) {
          const reserve_date = await new Date(record._fields[0].properties.time)
          const exposure = covid_dates.includes(reserve_date.getTime())
          if(exposure && (reserve_date >= reported) && (reserve_date <= today)) {
              const { email } = await User.findById(result4.records[index]._fields[0].properties.m_id)
              const alreadyAdded =  exposed_persons.includes(email);  
             if(!alreadyAdded && (user.email !== email)) {
              exposed_persons.push(email);
             }
          }
          index = index+ + 1
        }
        await txc.commit()
        console.log('committed')
        exposed_persons.forEach(email => {
          const msg = generateEmail(email);
          //sgMail.send(msg);
        })
        res.json({message: 'These people were alerted of their possible exposure by email',
                  emails: exposed_persons})
  } catch (error) {
        console.log(error)
        await txc.rollback()
        res.status(500).json({error: error})
        console.log('rolled back')
}
    finally {
        await session.close()
      }
})

module.exports = router;

