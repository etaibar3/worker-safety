const proxy = require("http-proxy-middleware");

module.exports = app => {
  app.use(proxy("/cors-anywhere/", { target: "https://herokuapp.com" }));
};


//https://cors-anywhere.herokuapp.com/mongodb+srv://benbodine:safereturn20@cluster0-ufozk.gcp.mongodb.net/safe-return?retryWrites=true&w=majority