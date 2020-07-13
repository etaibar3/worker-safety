const express = require("express");
const router = express.Router();
const Seat = require("../models/seat");
const { Mongoose } = require("mongoose");

router.post("/", async (req, res, next) => {
  const seat = new Seat(req.body);
  try {
    const result = await seat.save();
    res.status(201).json({
      message: "Added a new seat successfully",
      createdSeat: {
        seat_number: result.seat_number,
        available: result.available,
        type: result.geometry.type,
        coordinates: result.geometry.coordinates,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const results = await Seat.find();
    const response = {
      count: results.length,
      seats: results.map((result) => {
        return {
          seat_number: result.seat_number,
          available: result.available,
          _id: result._id,
          type: result.geometry.type,
          coordinates: result.geometry.coordinates,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/res", async (req, res, next) => {
  try {
    const results = await Seat.aggregate().near({
      near: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
      maxDistance: 2,
      spherical: true,
      distanceField: "dist.calculated",
    });
    const response = {
      count: results.length,
      seats: results.map((result) => {
        return {
          seat_number: result.seat_number,
          available: result.available,
          _id: result._id,
          type: result.geometry.type,
          coordinates: result.geometry.coordinates,
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/:seat_id", async (req, res, next) => {
  try {
    const id = req.params.seat_id;
    const result = await Seat.findById(id);
    result.remove();

    res.status(200).json({
      message: "Seat deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
