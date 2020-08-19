const proxy = require("http-proxy-middleware");
const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware("https://herokuapp.com");


module.exports = app => {
  //app.use(proxy("/cors-anywhere/", { target: "https://herokuapp.com" }));
  app.use('/api', apiProxy);
};
