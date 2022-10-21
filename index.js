const express = require("express");
const path = require("path");
const fs = require("fs");
const formidable = require("express-formidable");
const axios = require("axios");
const fse = require("fs-extra");
const app = express();

app.use(formidable());

app.use((req, res, next) => {
  //设置请求头
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Max-Age": 1728000,
    "Access-Control-Allow-Origin": req.headers.origin || "*",
  });
  next();
});

app.use(express.static("UI"));

app.use("/start-download", function (req, res) {
  let data = req.fields;

  let pathCreate = path.join(__dirname, "/out/" + data.timestamp + "/");
  try {
    fs.accessSync(pathCreate);
    res.status(500).json({ error: "此时间已失效" });
    return;
  } catch (error) {
    fse.ensureDirSync(pathCreate);
  }
  res.json({ code: 200 });
});
app.use("/download-tile", async function (req, res) {
  // console.log(req.fields);
  const data = req.fields;
  // download( );
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
  // fileType: image  file  auto

  let url = data.source
    .replaceAll("{z}", data.z)
    .replaceAll("{x}", data.x)
    .replaceAll("{y}", data.y)
    .replaceAll("{quad}", data.quad);
  let mapRes = {};
  try {
    mapRes = await axios({
      url: url,
      headers: {
        "Accept-Encoding": data.requestType == "yes" ? "gzip, deflate, br" : "",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
      },
      responseType: "arraybuffer",
    });
  } catch (error) {
    res.json({ code: 500, message: "下载错误：" + error });
    return;
  }
  const filePath = path.join(
    __dirname,
    "/out/" +
      data.timestamp +
      "/" +
      data.outputFile
        .replaceAll("{z}", data.z)
        .replaceAll("{x}", data.x)
        .replaceAll("{y}", data.y)
        .replaceAll("{quad}", data.quad)
  );
  fse.ensureFileSync(filePath);
  // let fileType = data.fileType;
  // if( fileType == "auto" ){
  //   let  contentType = res.headers['content-type'] || "";
  //   if(contentType.includes("image")){
  //     fileType = "image";
  //   }else{
  //     fileType = "file";
  //   }
  // }

  // if( fileType == "file" ){
  try {
    await fs.promises.writeFile(filePath, mapRes.data, "binary");
  } catch (error) {
    res.json({ code: 400, message: "保存失败：" + error });
    return;
  }
  // }else{
  // }
  // let  contentType = res.headers['content-type'] || "";
  // let isImage = contentType.includes("image");
  res.json({ code: 200, message: "成功", image: mapRes.data });
});

app.use("/end-download", function (req, res) {
  res.json({ code: 200 });
});

app.listen(9100, () => {
  console.log(`http://localhost:9100/index.html`);
});
