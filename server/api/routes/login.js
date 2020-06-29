require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const User = require("../models/Users.js");

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

/*Post request to authenticate user */
router.post("/", async (req, res) => {
  try {
    //Data Validation
    const { error } = await loginValidation.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      res.status(404).send("There is no user with this email.");
      return;
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(403).send("User name and password do not match.");

    /* TODO: 2nd argument of the follwing line should produce a token. Must be a hex value as a string */
    const token = jwt.sign(
      { _id: user._id, admin: user.admin },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.header("auth-token", token).send(token);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
