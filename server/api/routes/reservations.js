const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Reservation = require("../models/reservation");
const Employee = require("../models/employee");
const { restart } = require("nodemon");
const reservation = require("../models/reservation");
var neo4j = require("neo4j-driver");
const {authenticateUser } = require("../middleware/auth");

//Use post to create a person in neo4j to post and form relationships with. Will be removed after integration with mongodb
// app.post('/person', async function(req, res){
//   const session = driver.session();
//   const txc = session.beginTransaction()
//   var person_name = req.body.name;
//   console.log(person_name);

//   try{
//       const result1 = await txc.run(
//           'Create (n:Person {name: $Name}) return n' , {Name: person_name})

//       await txc.commit()
//   console.log('committed')
// } catch (error) {
//   console.log(error)
//   await txc.rollback()
//   console.log('rolled back')
// }

//   finally {
//       await session.close()
//     }
//     res.redirect('/person');

// })

// Post request to reserve the desired desk. Requires employee name and the name of the seat. Also configured to delete relationships
//after 18 days.
// app.post('/reserve', async function(req, res){
//   const session = driver.session();
//   const txc = session.beginTransaction()
//   var person_name = req.body.name;
//   var seat_num = req.body.number;
//     // Use of Date.now() method

//   try{
//       const result1 = await txc.run(
//           'Match (n:Person {name: $Name}),' +
//           ' (a:Seat{name: $id}) Create (n)-[r: Reserved {time: datetime()}]->(a) ' , {Name: person_name, id:seat_num })
//       const result2 = await txc.run( 'Match (a:Seat{name: $id}) SET a.reserved = true Return a', {id:seat_num})
//       console.log(result2._fields);

//       const result3 = await txc.run(
//           'MATCH (a:Person)-[r:Reserved]->(b:Seat) RETURN r.time')
//       const records = result3.records
//       for(let i = 0; i< records.length; i++){
//           let date = records[i]._fields[0];

//           var b = Date.parse(date);
//           if((Date.now()-b) > 1,555,200,000){
//               const result4 = await txc.run(
//                   'MATCH (a:Person)-[r:Reserved {time: $timestamp}]->(b:Seat) Delete r', {timestamp: date})

//           }
//       }
//       await txc.commit()
//   console.log('committed')
// } catch (error) {
//   console.log(error)
//   await txc.rollback()
//   console.log('rolled back')
// }

//   finally {
//       await session.close()
//     }
//     res.redirect('/person');

// })

const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "123456")
);


router.get("/", authenticateUser, async (req, res, next) => {
  try {
    const session = driver.session();
    const txc = session.beginTransaction(); 
    
    const result = await txc.run( 'Match (a:Users {m_id: $id}) - [r:Reserved] - (b: Seat) return b, r.time', 
                                  {id: req.user._id});
    const records = result.records;
    const reservations = await Promise.all(records.map(async (record) => {
        const reservation = {id: record._fields[0].properties.name,
                              date: record._fields[1] }
        return reservation;
    }))               

    console.log(result)
    
    res.status(200).json({reservations: reservations});
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.post("/", authenticateUser, async (req, res, next) => {
  // const employee = await Employee.findById(req.body.employee_id);
  // if (!employee) {
  //   return res.status(404).json({
  //     message: "Employee not found",
  //   });
  // }
  // const reservation = new Reservation({
  //   _id: new mongoose.Types.ObjectId(),
  //   employee: req.body.employee_id,
  //   seat_number: req.body.seat_number,
  // });
  const session = driver.session();
  const txc = session.beginTransaction(); 
  try {
   // const result = await reservation.save();
    var employee_id = req.user._id;
    var seat_number = req.body.seat_number;
    var reserv_date = req.body.date;

    const result1 = await txc.run(
      "Match (n:Users {m_id: $Name})," +
        " (a:Seat{name: $id}) Create (n)-[r: Reserved {time: date($date)}]->(a) return n",
      { Name: employee_id, id: seat_number, date: reserv_date }
    );

    const result8 = await txc.run(
      'Match (n: Seat {name : $id}) return n', 
      {id: seat_number}
    );

    console.log(result8)

    const result2 = await txc.run(
      "Match (a:Seat{name: $id}) SET a.reserved = true Return a",
      { id: seat_number }
    );
    const result3 = await txc.run(
      "MATCH (a:Users)-[r:Reserved]->(b:Seat) RETURN r.time"
    );

    const records = result3.records;
    for (let i = 0; i < records.length; i++) {
      let date = records[i]._fields[0];

      var b = Date.parse(date);
      if ((Date.now() - b > 1, 555, 200, 000)) {
        const result4 = await txc.run(
          "MATCH (a:Users)-[r:Reserved {time: $timestamp}]->(b:Seat) Delete r",
          { timestamp: date }
        );
      }
    }

    await txc.commit();
    console.log("committed");

    res.status(201).json({
      message: "Order stored",
      createdReservation: {
        employee: employee_id,
        seat_number: seat_number,
      },
      request: {
        type: "GET",
        url: "http://localhost:5000/reservations/",
      },
    });
  } catch (err) {
    await txc.rollback();
    console.log(err);
    res.status(500).json({
      error: err,
    });
  } finally {
    await session.close();
  }
});

// router.get("/:reservationId", async (req, res, next) => {
//   const id = req.params.reservationId;

//   try {
//     const result = await Reservation.findById(id);
//     if (result) {
//       res.status(200).json({
//         reservation: result,
//         request: {
//           type: "GET",
//           url: "http//localhost:5000/reservation",
//         },
//       });
//     } else {
//       res.status(404).json({ message: "Not valid" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err });
//   }
// });

// router.delete("/:reservation_id", async (req, res, next) => {
//   try {
//     const id = req.params.reservation_id;
//     const result = await Reservation.findById(id);
//     result.remove();

//     res.status(200).json({
//       message: "Reservation deleted",
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: err,
//     });
//   }
// });

module.exports = router;

