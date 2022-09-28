const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const formidable = require("express-formidable");
app.use(formidable()); // 中间件
// axios
//   .get(
//     "http://127.0.0.1:5000/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-bathymetry-v2,mapbox.mapbox-streets-v8/1/1/0.vector.pbf?sku=101U5LFnnCSNA&access_token=pk.eyJ1IjoiaG91bGFpZGVsdWEiLCJhIjoiY2w4bDlpZngzMGtxcTN1cDRnNG9qcDdyYSJ9.MtgwgbUiI4dtw6WY-sxyOQ"
//   )
//   .then((res) => {});
async function download() {
  let { data } = await axios({
    url: "http://127.0.0.1:5000/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-bathymetry-v2,mapbox.mapbox-streets-v8/1/1/0.vector.pbf?sku=101U5LFnnCSNA&access_token=pk.eyJ1IjoiaG91bGFpZGVsdWEiLCJhIjoiY2w4bDlpZngzMGtxcTN1cDRnNG9qcDdyYSJ9.MtgwgbUiI4dtw6WY-sxyOQ",
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
    responseType: "arraybuffer",
  });
  await fs.promises.writeFile(`./0.pbf`, data, "binary");
}
app.use((req, res, next) => {
  //设置请求头
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Max-Age": 1728000,
    "Access-Control-Allow-Origin": req.headers.origin || "*",
    // "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
    // "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
    // "Content-Type": "application/json; charset=utf-8",
  });
  next();
  // req.method === "OPTIONS" ? res.status(204).end() : next();
});

// app.use("/", express.static(path.join(__dirname, "UI")));
app.use(express.static("UI"));

app.use("/start-download", function (req, res) {
  let fields = req.fields;
  let pathCreate = path.join(__dirname, "/out/" + fields.timestamp + "/");
  try {
    fs.accessSync(pathCreate);
    res.status(500).json({ error: "此时间已失效" });
    return;
  } catch (error) {
    fs.mkdirSync(pathCreate);
  }
  // console.log(req.fields);
  // {
  //   minZoom: '1',
  //   maxZoom: '2',
  //   outputDirectory: '{timestamp}',
  //   outputFile: '{z}/{x}/{y}.png',
  //   outputType: 'directory',
  //   outputScale: '1',
  //   source: 'http://ecn.t0.tiles.virtualearth.net/tiles/a{quad}.jpeg?g=129&mkt=en&stl=H',
  //   timestamp: '1664360729877',
  //   bounds: '-73.99017513233417,40.73779215352124,-73.93369853931902,40.76458087245638',
  //   center: '-73.9619368358266,40.75118651298881,2'
  // }
  res.json({ code: 200 });
});
app.use("/download-tile", function (req, res) {
  console.log(req.fields);
  // x: 0
  // y: 0
  // z: 1
  // quad: 0
  // outputDirectory: {timestamp}
  // outputFile: {z}/{x}/{y}.png
  // outputType: directory
  // outputScale: 1
  // timestamp: 1664360433718
  // source: http://ecn.t0.tiles.virtualearth.net/tiles/a{quad}.jpeg?g=129&mkt=en&stl=H
  // bounds: -73.99017513233417,40.73779215352124,-73.93369853931902,40.76458087245638
  // center: -73.9619368358266,40.75118651298881,2
});
app.listen(9100, () => {
  console.log(`server is running on port ${9100}`);
});
