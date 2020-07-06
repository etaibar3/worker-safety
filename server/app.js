const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const employeeRoutes = require("./api/routes/employees");
const reservationRoutes = require("./api/routes/reservations");
const floorplanRoutes = require("./api/routes/floorplan");
const employeeAccRoutes = require("./api/routes/employee-accs");
const loginRoutes = require("./api/routes/login");
const orgRoutes = require("./api/routes/org");
const adminAccRotues = require("./api/routes/admin");
const logoutRoutes = require("./api/routes/logout");

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept, Authorization"
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

module.exports = app;
