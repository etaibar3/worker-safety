const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Reservation = require("../models/reservation");
const Employee = require("../models/employee");
const { restart } = require("nodemon");
const reservation = require("../models/reservation");

router.get("/", (req, res, next) => {
  Reservation.find()
    .select("employee _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        reservations: docs.map((doc) => {
          return {
            _id: doc._id,
            employee: doc.employee,
            request: {
              type: "GET",
              url: "http://localhost:300/reservations/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Employee.findById(req.body.employee_id)
    .then((employee) => {
      if (!employee) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }
      const reservation = new Reservation({
        _id: mongoose.Types.ObjectId(),
        employee_id: req.body.employee_id,
      });
      return reservation.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdReservation: {
          _id: result._id,
          employee: result.employee,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/reservations/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:reservationId", (req, res, next) => {
  Reservation.findById(req.params.reservationId)
    .exec()
    .then((reservation) => {
      if (!reservation) {
        return res.status(404).json({
          message: "Reservation not found",
        });
      }
      res.status(200).json({
        reservation: reservation,
        request: {
          type: "GET",
          url: "http//localhost:3000/reservation",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
