const express = require("express");
const router = express.Router();
const Seat = require("../models/seat");
const { Mongoose } = require("mongoose");
var neo4j = require("neo4j-driver");

const driver = neo4j.driver(  "bolt://localhost", neo4j.auth.basic("neo4j", "123456"));

router.post('/add', async function(req, res){
  const session = driver.session();
  const txc = session.beginTransaction()
  var name = req.body.id;
  var Xvalue = req.body.Xcoord;
  var Yvalue = req.body.Ycoord;
  
      try{
          console.log(`Xval: ${Xvalue}`)
          console.log(`Yval: ${Yvalue}`)
          const result1 = await txc.run(
              'Create (n:Seat {name: $id,' +
              'location: point({ x: $Xcoord, y: $Ycoord, crs: "cartesian"}), reserved:false}) RETURN n.name', {id: name, Xcoord: Xvalue, Ycoord: Yvalue })
            
          var result2 = await txc.run('Match (n:Seat) return n')
          const records = result2.records
          // console.log(result2);
          for(let i = 0; i< records.length; i++){
              var location_value  = records[i].get(0).properties.location;
              // console.log(location_value);
              const result3 =   txc.run('MATCH (n:Seat {name: $id}), (b:Seat {location: $point }) return distance(n.location, b.location ) AS Distance', {id: name, point: location_value })
              // const result3 = Seat.cypherQuery('MATCH (n:Seat {name: $firstParam}), (b:Seat {location: $point }) return distance(n.location, b.location) AS Distance', {firstParam: name, point: location })
              const records2 = (await result3).records;
              var distance = records2[0]._fields[0]; 
              console.log(distance);
              

              if(distance > 0 && distance < 6){

                  

                  const result4 =  txc.run('MATCH (n:Seat {name: $id}), (b:Seat {location: $point }) Create (n)-[r:Within_dist]->(b) Return b', {id: name, point: location_value })
              }
          }

      await txc.commit()
      console.log('committed')
      res.json({msg: "Okay"})
    } catch (error) {
      console.log(error)
      await txc.rollback()
      console.log('rolled back')
  }
      

      finally {
          await session.close()
        }
  })



// router.post("/", async (req, res, next) => {
//   try {
//     const seat = new Seat(req.body);
//     const result = await seat.save();
//     res.status(201).json({
//       message: "Added a new seat successfully",
//       createdSeat: {
//         seat_number: result.seat_number,
//         available: result.available,
//         type: result.geometry.type,
//         coordinates: result.geometry.coordinates,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// });

// router.get("/", async (req, res, next) => {
//   try {
//     const results = await Seat.find();
//     const response = {
//       count: results.length,
//       seats: results.map((result) => {
//         return {
//           seat_number: result.seat_number,
//           available: result.available,
//           _id: result._id,
//           type: result.geometry.type,
//           coordinates: result.geometry.coordinates,
//         };
//       }),
//     };
//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// });

// router.get("/res", async (req, res, next) => {
//   try {
//     const results = await Seat.aggregate().near({
//       near: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
//       maxDistance: 2,
//       spherical: true,
//       distanceField: "dist.calculated",
//     });
//     const response = {
//       count: results.length,
//       seats: results.map((result) => {
//         return {
//           seat_number: result.seat_number,
//           available: result.available,
//           _id: result._id,
//           type: result.geometry.type,
//           coordinates: result.geometry.coordinates,
//         };
//       }),
//     };
//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// });

// router.delete("/:seat_id", async (req, res, next) => {
//   try {
//     const id = req.params.seat_id;
//     const result = await Seat.findById(id);
//     result.remove();

//     res.status(200).json({
//       message: "Seat deleted",
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: err,
//     });
//   }
// });

module.exports = router;
