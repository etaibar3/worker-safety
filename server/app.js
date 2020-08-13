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
//var neo4j = require('neo4j-driver');

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

// const fileUpload = require("express-fileupload");

const Floorplan = require("./api/models/floorplan");

const fileUpload = require("express-fileupload");
const reportRoutes = require("./api/routes/report");


// app.set("view", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
app.set("view engine", "ejs");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  process.env.GRAPHENEDB_BOLT_URL || "bolt://localhost",
  neo4j.auth.basic(process.env.GRAPHENEDB_BOLT_URL  || "neo4j", process.env.GRAPHENEDB_BOLT_PASSWORD || "123456")
);

const session = driver.session();
const mongo4j = require("mongo4j");
mongo4j.init(process.env.GRAPHENEDB_URL || "neo4j://localhost", { user: process.env.GRAPHENEDB_BOLT_URL || "neo4j", pass: process.env.GRAPHENEDB_BOLT_PASSWORD || "123456" });

mongoose.Promise = global.Promise;

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser())
// app.use("/uploads", express.static("uploads"));
app.use("/public/uploads", express.static("public/uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
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
app.use("/upload", floorplanRoutes);

app.use("/employee", employeeAccRoutes);
app.use("/login", loginRoutes);
app.use("/org", orgRoutes);
app.use("/admin", adminAccRotues);
app.use("/logout", logoutRoutes);
app.use("/forgot-password", resetPassRoutes);
app.use("/seats", seatRoutes);

// app.use(fileUpload());


app.use("/report", reportRoutes);
app.use(fileUpload());

// const storage = multer.diskStorage({
//   destination: "./public/uploads/",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).single("myImage");

// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

// app.get("/", (req, res) => res.render("index"));

//upload
// app.post("/upload", (req, res) => {
//   console.log("is it working");
//   upload(req, res, (err) => {
//     if (err) {
//       console.log("err");
//       res.render("index", {
//         msg: err,
//       });
//     } else {
//       if (req.file == undefined) {
//         console.log("undefined");
//         res.render("index", {
//           msg: "Error: No File Selected!",
//         });
//       } else {
//         console.log("succ");
//         res.render("index", {
//           msg: "File Uploaded!",
//           file: `uploads/${req.file.filename}`,
//         });
//       }
//     }
//   });
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, callback) => {
//       let path = "./public/uploads";
//       fs.mkdirsSync(path);
//       callback(null, path);
//     },
//     filename: (req, file, callback) => {
//       callback(null, file.originalname);
//     },
//     limits: {
//       fileSize: 1024 * 1024 * 5,
//     },
//     // fileFilter: fileFilter,
//   }),

//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   // fileFilter: fileFilter,
// });

// app.post("/upload", upload.single("floorplanImage"), (req, res, next) => {
//   console.log(req.file);
//   const floorplan = new Floorplan({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     floorplanImage: req.file.path,
//   });
//   floorplan
//     .save()
//     .then((result) => {
//       console.log(result);
//       res.status(201).json({
//         message: "Image uploaded successfully",
//         createdFloorplan: {
//           name: result.name,
//           floorplanImage: result.floorplanImage,
//           _id: result._id,
//           request: {
//             type: "GET",
//             url: "http//localhost:3000/floorplan/" + result._id,
//           },
//         },
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

// app.post("/upload", async (req, res, next) => {
//   //console.log("working");
//   try {
//     if (req.files === null) {
//       return res.status(400).json({ msg: "No file uploaded" });
//     }

//     const file = req.files.file;

//     file.mv(`${__dirname}/public/uploads/${file.name}`, (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send(err);
//       }
//       res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
//     });
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// });



//app.listen(port, () => console.log("Server Started..."));

// admin_server.listen(5000, () => console.log("admin"));


//const port = 3000;
//app.listen(port, () => console.log(`Server started on port ${port}`));
// app.listen(5000, () => console.log("Server Started..."));

module.exports = app;
