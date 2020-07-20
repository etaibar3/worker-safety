const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Employee = require("../models/employee");

router.get("/", async (req, res, next) => {
  try {
    const results = await Employee.find();
    const response = {
      count: results.length,
      employees: results.map((result) => {
        return {
          name: result.name,
          employee_id: result.employee_id,
          currentSeat: result.currentSeat,
          request: {
            type: "GET",
            url: "http://localhost:5000/employees/" + result._id,
          },
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:employeeId", async (req, res, next) => {
  const id = req.params.employeeId;

  try {
    const result = await Employee.findById(id);
    if (result) {
      res.status(200).json({
        employee: result,
        request: {
          type: "GET",
          url: "http://localhost:3000/employees",
        },
      });
    } else {
      res.status(404).json({ message: "Not valid" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/", async (req, res, next) => {
  const employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    employee_id: req.body.employee_id,
  });

  try {
    const result = await employee.save();
    res.status(201).json({
      message: "Added a new employee successfully",
      createdEmployee: {
        name: result.name,
        employee_id: result.employee_id,
        request: {
          type: "GET",
          url: "http//localhost:5000/employees/" + result._id,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.patch("/:employee_id", async (req, res, next) => {
  try {
    const id = req.params.employee_id;
    const result = await Employee.updateOne(
      { _id: id },
      { $set: { employee_id: req.body.employee_id } }
    );
    res.status(200).json({
      message: "Employee information updated",
      request: {
        type: "GET",
        url: "http//localhost:3000/employees" + id,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.delete("/:employee_id", async (req, res, next) => {
  try {
    const id = req.params.employee_id;
    const result = await Employee.findById(id);
    result.remove();

    res.status(200).json({
      message: "Employee account deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/employees",
        body: { name: "String", employee_id: "String" },
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
