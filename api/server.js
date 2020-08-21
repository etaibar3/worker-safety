const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();

require("./app/routes")(app, {});
app.listen(port, () => {
  console.log("here" + 3000);
});
