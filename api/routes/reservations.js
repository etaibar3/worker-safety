const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Reservation = require("../models/reservation");
const Employee = require("../models/employee");
const { restart } = require("nodemon");
const reservation = require("../models/reservation");
var neo4j = require("neo4j-driver");
const { authenticateUser } = require("../middleware/auth");

const driver = neo4j.driver(
  process.env.GRAPHENEDB_BOLT_URL || "bolt://localhost",
  neo4j.auth.basic(
    process.env.GRAPHENEDB_BOLT_USER || "neo4j",
    process.env.GRAPHENEDB_BOLT_PASSWORD || "123456"
  ),
  { encrypted: "ENCRYPTION_ON", trust: "TRUST_ALL_CERTIFICATES" }
);

router.get("/", authenticateUser, async (req, res, next) => {
  const session = driver.session();
  const txc = session.beginTransaction();
  try {
    const result = await txc.run(
      "Match (a:Users {m_id: $id}) - [r:Reserved] - (b: Seat) return b, r.time ORDER BY r.time DESC ",
      { id: req.user._id }
    );
    const records = result.records;
    const reservations = await Promise.all(
      records.map(async (record) => {
        const reservation = {
          id: record._fields[0].properties.name,
          date: record._fields[1],
        };
        return reservation;
      })
    );

    res.status(200).json({ reservations: reservations });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
});

router.post("/", authenticateUser, async (req, res, next) => {
  const session = driver.session();
  const txc = session.beginTransaction();
  const name = req.body.seat_number;

  var exist = await txc.run("Match (n:Seat {name: $id}) return n", {
    id: name,
  });
  const arr = exist.records;
  if (arr.length === 0) {
    return res.status(404).json({
      message: "Desk does not exist",
    });
  }

  var result2 = await txc.run("Match (n:Seat) return n");
  const records = result2.records;

  for (let i = 0; i < records.length; i++) {
    var location_value = records[i].get(0).properties.location;

    const result3 = txc.run(
      "MATCH (n:Seat {name: $id}), (b:Seat {location: $point }) return distance(n.location, b.location ) AS Distance",
      { id: name, point: location_value }
    );

    const records2 = (await result3).records;
    var distance = records2[0]._fields[0];
    if (distance > 0 && distance < 6) {
      return res.status(403).json({
        message:
          " The desk is too close with some other desks that have been reserved",
      });
    }
  }

  try {
    const employee = await Employee.findById(req.body.employee_id);
    const temp = parseInt(req.body.seat_number, 10);
    console.log(employee.reserveredSeats);
    for (var i in employee.reserveredSeats) {
      if (employee.reserveredSeats[i] === temp) {
        return res.status(403).json({
          message: "The seat has aleady reserved",
        });
      }
    }
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }
    const reservation = new Reservation({
      _id: new mongoose.Types.ObjectId(),
      employee: req.body.employee_id,
      seat_number: req.body.seat_number,
    });

    const result = await reservation.save();

    var employee_id = employee.id;
    var seat_number = req.body.seat_number;
    employee.reserveredSeats.push(seat_number);
    employee.save();
    console.log(employee.reserveredSeats);

    const result1 = await txc.run(
      "Match (n:Employee {m_id: $Name})," +
        " (a:Seat{name: $id}) Create (n)-[r: Reserved {time: datetime()}]->(a) ",
      { Name: employee_id, id: seat_number }
    );
    const setSeat = await txc.run(
      "Match (a:Seat{name: $id}) SET a.reserved = true Return a",
      { id: seat_number }
    );
    const result3 = await txc.run(
      "MATCH (a:Employee)-[r:Reserved]->(b:Seat) RETURN r.time"
    );

    const records_ = result3.records;
    for (let i = 0; i < records_.length; i++) {
      let date = records_[i]._fields[0];

      var b = Date.parse(date);
      if ((Date.now() - b > 1, 555, 200, 000)) {
        const result4 = await txc.run(
          "MATCH (a:Person)-[r:Reserved {time: $timestamp}]->(b:Seat) Delete r",
          { timestamp: date }
        );
      }
    }

    await txc.commit();
    console.log("committed");

    res.status(201).json({
      message: "Reservation stored",
      createdReservation: {
        _id: result._id,
        employee: result.employee_id,
        seat_number: result.seat_number,
      },
      request: {
        type: "GET",
        url: "http://localhost:5000/reservations/" + result._id,
      },
    });
  } catch (err) {
    await txc.rollback();
  } finally {
    await session.close();
  }
});

router.delete("/", authenticateUser, async (req, res, next) => {
  const session = driver.session();
  const txc = session.beginTransaction();
  var reserv_date = req.body.date;

  try {
    console.log(reserv_date);
    const result = await txc.run(
      "Match (a:Users {m_id: $id}) - [r:Reserved {time: date($date)}] - (b: Seat) Delete r",
      { id: req.user._id, date: reserv_date }
    );

    res.json({ msg: "Reservation Successfully Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Unable to delete reservation.",
    });
  }
});

module.exports = router;
