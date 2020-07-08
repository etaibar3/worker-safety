const http = require("http");
const express = require("express");
const app = require("./app");
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const mongoose = require("mongoose");

//app.use(express.json());

mongoose.connect(
  "mongodb://localhost:27017/worker-saftey",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("successfully connected to databasae");
  }
);

//app.get("/", function (req, res) {});
server.listen(port);

/*Add routes created in other files here*/

//React app uses port 3000
// app.listen(5000, () => {
//     console.log('server started');
// });
