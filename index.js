const express = require("express");
const proxy = require("http-proxy-middleware");
// http-proxy-middleware版本1.0.5的时候默认导出的不是proxy的函数了，需要用以下注释的方式调用
// const { createProxyMiddleware: proxy } = require("http-proxy-middleware");
const path = require("path");
const { port = 8000, proxy: proxyConfig = {} } = require("./serverConfig");
const app = express();

// app.use(express.static("tiles"));
app.use((req, res, next) => {
  //设置请求头
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Max-Age": 1728000,
    "Access-Control-Allow-Origin": req.headers.origin || "*",
    "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
    "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  req.method === "OPTIONS" ? res.status(204).end() : next();
});

app.use("/", express.static(path.join(__dirname, "static")));

Object.keys(proxyConfig).map((key) => {
  app.use(key, proxy(proxyConfig[key]));
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
