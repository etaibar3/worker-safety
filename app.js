const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const ejs = require("ejs");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs-extra");
const cookieParser = require('cookie-parser')
const rate_limit = require('express-rate-limit');
const port = process.env.PORT || 5000;


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
//const Floorplan = require("./api/models/floorplan");
const fileUpload = require("express-fileupload");
const reportRoutes = require("./api/routes/report");

const default_limiter = rate_limit({
    windowMS: 60 * 1000 * 30, //30 minutes
    max: 100,
    message: "Exceeded number of allowed requests."
})
app.use(default_limiter);
const create_account_limiter = rate_limit({
  windowMS: 60 * 1000 * 30, //30 minutes
  max: 5,
  message: "Exceeded number of allowed requests."
})
app.use('/api/employee', create_account_limiter);
app.use('/api/admin', create_account_limiter);

app.set("view", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("view engine", "ejs");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  process.env.GRAPHENEDB_BOLT_URL || "bolt://localhost",
  neo4j.auth.basic(process.env.GRAPHENEDB_BOLT_USER || "neo4j", process.env.GRAPHENEDB_BOLT_PASSWORD || "123456"),
  {encrypted: 'ENCRYPTION_ON', trust: 'TRUST_ALL_CERTIFICATES'}
);

const session = driver.session();
const mongo4j = require("mongo4j");
mongo4j.init(process.env.GRAPHENEDB_BOLT_URL || "neo4j://localhost", 
{ user: process.env.GRAPHENEDB_BOLT_USER || "neo4j", pass: process.env.GRAPHENEDB_BOLT_PASSWORD || "123456" },
{encrypted: 'ENCRYPTION_ON', trust: 'TRUST_ALL_CERTIFICATES'});

mongoose.Promise = global.Promise;

app.use(cors({credentials: true, origin: process.env.HOST || 'http://localhost:3000'}));
app.use(morgan("dev"));
app.use(cookieParser())
// app.use("/uploads", express.static("uploads"));
app.use("/public/uploads", express.static("public/uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth, Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials"
  );
  
  res.setHeader("Access-Control-Allow-Origin", process.env.HOST || "http://localhost:3000");

  //res.setHeader("Access-Control-Allow-Methods", "OPTIONS,PUT,POST,PATCH,DELETE,GET");
   if (req.method === "OPTIONS") {
     res.setHeader("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
     return res.status(200).json({});
   }
  next();
});

app.use("/api/employees", employeeRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/floorplan", floorplanRoutes);
app.use("/api/upload", floorplanRoutes);

app.use("/api/employee", employeeAccRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/admin", adminAccRotues);
app.use("/api/logout", logoutRoutes);
app.use("/api/forgot-password", resetPassRoutes);
app.use("/api/seats", seatRoutes);

// app.use(fileUpload());


app.use("/report", reportRoutes);
app.use(fileUpload());

module.exports = app;
