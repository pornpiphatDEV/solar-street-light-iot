
let express = require("express");
let cors = require("cors");
let app = express();
let bodyParser = require("body-parser");
let mysql = require("mysql");
let db = require("./config/config").db;
const fileUpload = require("express-fileupload");
const fs = require("fs");
let LogModel = require('./model/logmodel');
let log_db  = require("./config/logdbconfig").log_db;
// let md5 = require("md5");




app.use(cors());
app.use(express.json());
let propsData = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //to access the files in public folder
app.use(fileUpload());

app.use(express.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.send("Sora api by ENCLL");
});

// app.use(express.static('public'));
app.use("/images", express.static("public"));
app.use("/document", express.static("document"));
app.post("/upload", async (req, res) => {
  console.log(req.body.userpost);
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  const myFile = req.files.file;
  // console.log(myFile);
  let imgsprofile = `img-${myFile.md5}.png`;
  myFile.mv(`${__dirname}/public/img-${myFile.md5}.png`, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occured" });
    }

    db.query(
      "UPDATE users SET imagesprofile = ? WHERE (username = ?);",
      [imgsprofile, req.body.userpost],
      (err, result) => {
        if (err) throw console.log(err);
        res.send(result);
      }
    );
    // return res.send({ name: myFile.name, path: `/${myFile.name}` });
  });
});

app.post('/logout' ,  (req,res) => {
  let username = req.body.username;
  let ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let sql = `insert into userlog_table(username, event, ipaddress, status_success) VALUES ('${username}','logout','${ipaddress}','${1}');`
  console.log(sql);
  log_db.query(sql,(err,result) => {
      try {
          res.send(result);
      } catch (err) {
          console.log(err);
      }
  });
});





const userRouter = require("./routers/user");
const stackRouter = require("./routers/stack");
app.use("/user", userRouter);
app.use("/stack", stackRouter);

app.listen(propsData, () => {
  console.log("Start server api port 3000");
});
