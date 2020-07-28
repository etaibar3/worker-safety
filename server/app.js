const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
//var neo4j = require('neo4j-driver');
require('dotenv').config()


const employeeRoutes = require("./api/routes/employees");
const reservationRoutes = require("./api/routes/reservations");
const floorplanRoutes = require("./api/routes/floorplan");
const employeeAccRoutes = require("./api/routes/employee-accs");
const loginRoutes = require("./api/routes/login");
const orgRoutes = require("./api/routes/org");
const adminAccRotues = require("./api/routes/admin");
const logoutRoutes = require("./api/routes/logout");
const resetPassRoutes = require("./api/routes/resetpassword");
const seatRoutes = require("./api/routes/seats");

app.set("view", path.join(__dirname, "views"));
app.set("view engin", "ejs");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "123456")
);

const session = driver.session();
const mongo4j = require("mongo4j");
mongo4j.init("neo4j://localhost", { user: "neo4j", pass: "123456" });

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept, Authorization, auth"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,Get");
    return res.status(200).json({});
  }
  next();
});

app.use("/employees", employeeRoutes);
app.use("/reservations", reservationRoutes);
app.use("/floorplan", floorplanRoutes);
app.use("/employee", employeeAccRoutes);
app.use("/login", loginRoutes);
app.use("/org", orgRoutes);
app.use("/admin", adminAccRotues);
app.use("/logout", logoutRoutes);
app.use("/forgot-password", resetPassRoutes);
app.use("/seats", seatRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.get("/", (req, res) => {
  res.send("test");
});

app.use(cors());

console.log(process.env.SENDGRID_API_KEY)

module.exports = app;
