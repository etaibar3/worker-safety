const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Employee = require("../models/employee");

router.get("/", (req, res, next) => {
  Employee.find()
    .select("name employee_id currentSeat")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            employee_id: doc.employee_id,
            currentSeat: doc.currentSeat,
            request: {
              type: "GET",
              url: "http://localhost:3000/employees/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    employee_id: req.body.employee_id,
    currentSeat: req.body.currentSeat,
  });
  employee
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Added a new employee successfully",
        createdEmployee: {
          name: result.name,
          employee_id: result.employee_id,
          currentSeat: result.currentSeat,
          request: {
            type: "GET",
            url: "http//localhost:3000/employees/" + result.employee_id,
          },
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

module.exports = router;
