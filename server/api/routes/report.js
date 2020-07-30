const express = require("express");
const router = express.Router();
// const Seat = require("../models/seat");
const { Mongoose } = require("mongoose");
var neo4j = require("neo4j-driver");

const driver = neo4j.driver(  "bolt://localhost", neo4j.auth.basic("neo4j", "123456"));


app.post('/', async function(req, res){
    const session = driver.session();
    const txc = session.beginTransaction()
    var person_name = req.body.name;
      // Use of Date.now() method 



    try{
        const result1 = await txc.run( 'Match (a:Person {name: $Name}) SET a.covid_19 = true, a.Date_of_part = datetime() Return a', {Name: person_name})
        const result2 = await txc.run( 'Match (a:Person {name: $Name}) -[:Reserved] -(b:Seat) - [:Within_dist] - (c:Seat)-[:Reserved] - (d:Person) Set d.Exposed =true return d ', {Name: person_name})     
        
        console.log(result2.records[0].get(0));
        const result3 = await txc.run( 'Match (a:Person {name: $Name}) -[:Reserved] -(b:Seat) -[:Reserved] - (d:Person) Set d.Exposed = true return d ', {Name: person_name})
        console.log(result3.records[0].get(0));

        await txc.commit()
    console.log('committed')
  } catch (error) {
    console.log(error)
    await txc.rollback()
    console.log('rolled back')
}
    

    finally {
        await session.close()
      }
      res.redirect('/person');



})

module.exports = router;

