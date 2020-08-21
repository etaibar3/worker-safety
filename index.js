const http = require("http");
const express = require("express");
//const app = express();
const app = require("./app");
const port = process.env.PORT || 5000;
const path = require('path');
//const server = http.createServer(app);
const mongoose = require("mongoose");
//app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/worker-safety",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
  (err, db) => {
    if(err) { return console.dir(err); }
    console.log("successfully connected to databasae");
    const tokenCollection = db.collection('tokens');
    tokenCollection.createIndex({'expiresAt': 1}, {expireAfterSeconds: 0});
    // const reservationCollection = db.collection('reservations');
    // reservationCollection.createIndex( {'date_created': 1}, {expireAfterSeconds: 1555200}); //18 days in seconds
  }
);

//app.get("/", function (req, res) {});
//server.listen(port);

/*Add routes created in other files here*/

//React app uses port 3000
// app.listen(5000, () => {
//     console.log('server started');
// });

if (process.env.NODE_ENV === 'production') {
  /* in app.js file after we add all the routes*/
  app.use(express.static( './client/build'))
  //Do const path = require(‘path’) at top of file
  app.get ('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// app.get("/",(req,res)=>{
//   res.send("Test");
// })

app.listen(port,()=>{
  console.log("index.js message prints here")
})

