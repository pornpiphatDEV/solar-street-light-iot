let express = require("express");
let mysql = require("mysql");
let db = require("../config/config").db;

let jwt = require("jsonwebtoken");
let passport = require("passport");
let LogModel = require('../model/logmodel');


module.exports.test = async (req, res) => {
  res.send("hello");
};

module.exports.singup = async (req, res) => {
  console.log(req.body);
  let username = req.body.username;
  let email = req.body.email;
  let password = jwt.sign(req.body.password, "your_jwt_secret");
  let phonenumbar = req.body.phonenumbar;
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  db.query(
    "select * from users where username = ?",
    [username],
    (err, result) => {
      if (err) {
        res.status(500)
          .json({
            message: err
          })
      } else {
        if (result.length > 0) {
          LogModel.loguserdb(username, 'singuperror_usernamealready', ip, 0);
          res.status(401)
            .json({
              message: "มีชื่อผู้ใช้นี้แล้วในระบบ"
            })
        } else {
          db.query(
            "select * from users where email = ?",
            [email],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                if (result.length > 0) {
                  LogModel.loguserdb(username, 'singuperror_emailalready', ip, 0);
                  res.status(401)
                    .json({
                      message: "Email ถูกใช้งานแล้ว"
                    })
                } else {
                  db.query(
                    "INSERT INTO users(username, password, email, Phone_number,status) VALUES (?,?,?,?,0);",
                    [username, password, email, phonenumbar],
                    (err, result) => {
                      if (err) {

                        res.send(err);
                      } else {
                        LogModel.loguserdb(username, 'singup', ip, 1);
                        res.send("ok");
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  );
};

module.exports.login = async (req, res) => {
  console.log(req.body);
  console.log(jwt.sign(req.body.password, "your_jwt_secret"));
  let username = req.body.username;
  let password = jwt.sign(req.body.password, "your_jwt_secret");
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
  db.query(
    "select * from users where username = ? and  password = ?;",
    [username, password],
    (err, result) => {
      if (err) {
        // console.log(err);
        res.status(500)
          .json({
            message: err
          })
      } else {
        if (result.length > 0) {
          if (result[0].status === 0) {
            // res.send("noaccepting");
            LogModel.loguserdb(username, 'login', ip, 1);
            res.status(202)
              .json({
                message: "noaccepting"
              })
          } else {
            LogModel.loguserdb(username, 'login', ip, 1);
            res.status(200)
              .json({
                message: result
              })
          }
        } else {
          LogModel.loguserdb(username, 'login error', ip, 0);
          res.status(401)
            .json({
              message: "This user does not exist in the system. "
            })
        }
      }
    }
  );
};

module.exports.profile = async (req, res) => {
  console.log(req.params.user);
  let user = req.params.user;
  db.query(
    "select imagesprofile from users where username = ?",
    [user],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
};

module.exports.acceptpolicy = async (req, res) => {
  console.log(req.body);
  let username = req.body.username;
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  db.query(
    "UPDATE users SET status = '1' WHERE (username = ?);",
    [username],
    (err, result) => {
      if (err) throw console.log(err);
      LogModel.loguserdb(username, 'acceptpolicy', ip, 1);
      console.log(result);
      res.send(result);
    }
  );
};

module.exports.listprojact = async (req, res) => {
  console.log(req.params.user);
  let user = req.params.user;
  db.query(
    "SELECT idtable1, Projact_name,place FROM Project_table inner join users on Project_table.user_users_id = users.users_id  where username = ?",
    [user],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
};

// router.get('/getdevicilst:projactname')

module.exports.listdevic = async (req, res) => {
  let sqlquery =
    "SELECT  users_id ,username, Project_table.Projact_name ,place,devic_infoDB.devicname,latitude, longitude FROM users ";
  sqlquery +=
    "inner join Project_table on Project_table.user_users_id = users.users_id ";
  sqlquery +=
    "inner join token_table on token_table.Project_table_idtable1 = Project_table.idtable1";
  sqlquery +=
    " inner join devic_infoDB on  devic_infoDB.token_table_token_id= token_table.token_id ";
  sqlquery += `where Project_table.Projact_name = '${req.params.projactname}'`;

  db.query(sqlquery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
};


// Change account name

module.exports.changeaccountname = async (req, res) => {
  console.log(req.body);
  // res.send("changeaccountname : " + req.body);
  let newusername = req.body.newusername;
  let username = req.body.username;
  let password = jwt.sign(req.body.password, "your_jwt_secret");
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;





  console.log(password);
  let sqlquery = `select * from users where username = '${username}' and password ='${password}';`
  db.query(sqlquery, (err, result) => {

    console.log(result);
    try {
      if (result.length > 0) {
        let id = result[0].users_id;
        let sqlquery = `UPDATE users SET username = '${newusername}' WHERE (users_id = '${id}');`;
        db.query(sqlquery, (err, result) => {
          try {
            LogModel.lognewusernamedb(username, 'newusername', ip, newusername, 1);
            res.status(200)
              .json({
                message: result
              })
          } catch (error) {
            res.status(500)
              .json({
                message: err
              })
          }
        });
      } else {
        LogModel.lognewusernamedb(username, 'newusername', ip, newusername, 0);
        res.status(401)
          .json({
            message: "not correct password"
          })
      }
    } catch (err) {
      res.status(500)
        .json({
          message: err
        })
    }
  });
}

module.exports.changepassword = async (req, res) => {
  console.log(req.body);
  let username = req.body.username;
  let phonenumber = req.body.phonenumber;
  let password = jwt.sign(req.body.password, "your_jwt_secret");
  let sqlquery = `select * from  users where username = '${username}' and Phone_number="${phonenumber}";`
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  db.query(sqlquery, (err, result) => {
    try {
      if (result.length > 0) {
        let id = result[0].users_id;
        let sqlquery = `UPDATE users SET password = '${password}' WHERE (users_id = '${id}');`;
        db.query(sqlquery, (err, result) => {
          try {
            LogModel.lognewpassworddb(username, 'newpassword', ip, password, 1);
            res.status(200)
              .json({
                message: result
              })
          } catch (error) {
            res.status(500)
              .json({
                message: err
              })
          }
        });
      } else {
        LogModel.lognewpassworddb(username, 'newpassword', ip, password, 0);
        res.status(401)
          .json({
            message: "not correct password"
          })
      }
    } catch (err) {
      res.status(500)
        .json({
          message: err
        })
    }
  });
}
