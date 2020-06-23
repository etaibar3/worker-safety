const http = require("http");
const express = require("express");
const app = require("./app");
const port = process.env.PORT || 3000;
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

server.listen(port);
//React app uses port 3000
// app.listen(5000, () => {
//     console.log('server started');
// });
