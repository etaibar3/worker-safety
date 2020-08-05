const express = require("express");
const router = express.Router();
const {authenticateUser} = require('../middleware/auth')
// const Seat = require("../models/seat");
const { Mongoose } = require("mongoose");
var neo4j = require("neo4j-driver");

const driver = neo4j.driver(  "bolt://localhost", neo4j.auth.basic("neo4j", "123456"));


router.post('/', authenticateUser, async function(req, res){
    const session = driver.session();
    const txc = session.beginTransaction()
    var person_name = req.user._id;
    var report_date = req.body.date;
      // Use of Date.now() method 

    try{
        //const result1 = await txc.run( 'Match (a:Users {m_id: $Name}) SET a.COVID19 = true, a.date = date($date) Return a', {Name: person_name, date: report_date})
        const result2 = await txc.run( 'Match (a:Users {m_id: $Name}) -[:Reserved] -(b:Seat) - [:Within_dist] - (c:Seat)-[:Reserved] - (d:Users) return d', {Name: person_name})
        //const result3 = await txc.run( 'Match (a:Users {m_id: $Name}) -[:Reserved] -(b:Seat) -[:Reserved] - (d:Users) return d ', {Name: person_name})
        const result4 = await txc.run('Match (n:Users {m_id: $Name}) return n', {Name: person_name})
        console.log(result2)
        console.log(result4)
        console.log(person_name)
        await txc.commit()
    console.log('committed')
    res.json({message: 'ok'})
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

