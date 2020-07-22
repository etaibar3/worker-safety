const http = require("http");
const express = require("express");
const app = require("./app");
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const mongoose = require("mongoose");
//app.use(express.json());

mongoose.connect(
  "mongodb://localhost:27017/worker-saftey",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
  (err, db) => {
    if(err) { return console.dir(err); }
    console.log("successfully connected to databasae");
    const tokenCollection = db.collection('tokens');
    tokenCollection.createIndex({'expiresAt': 1}, {expireAfterSeconds: 0});
    // const seats = db.collection('seats');
    // db.seats.createIndex({"geometry":"2dsphere"});
  }
);

//app.get("/", function (req, res) {});
server.listen(port);

/*Add routes created in other files here*/

//React app uses port 3000
// app.listen(5000, () => {
//     console.log('server started');
// });
