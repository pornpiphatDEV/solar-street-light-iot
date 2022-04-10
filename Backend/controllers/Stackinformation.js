let express = require("express");
let mysql = require("mysql");
let db = require("../config/config").db;
let lib = require("../library/library");
let notification = require("../library/notification");


module.exports.teststack = async (req, res) => {
  res.send("hello ok");
};

module.exports.getwatthout = async (req, res) => {
  console.log(req.params.devicname);
  let devicname = req.params.devicname;
  let sql = `select devicname , latitude,longitude , solar_watt_hour,battery_watt_hour, led_watt_hour ,time_updated from  devic_infoDB 
  inner join watt_hour on devic_infoDB.devic_info_id = watt_hour.devic_infoDB_devic_info_id 
  where devicname = "${devicname}";`;

  db.query(sql, (err, result) => {
    if (err) throw res.send(err);
    res.send(result);
  });
};


// ตรวจสอบและแจ้งเตือน
// module.exports.notification = async (req, res, next) => {
//   console.log('Request Type:', req.method)
//   console.log(req.body);
//   let devicname = req.body.devicname;
//   let volt_solar = req.body.volt_solar;
//   let volt_battery = req.body.volt_battery;
//   let volt_led = req.body.volt_led;

//   let sql = `select devic_info_id,devicname from devic_infoDB where devicname = ?;`;
//   db.query(sql, [devicname], (err, result) => {
//     if (err) throw res.send(err);
//     if (result.length > 0) {


//       // ************************************************************
//       // แบตเตอร์รี่                                                   
//       // ************************************************************
//       result.forEach((element) => {
//         devic_info_id = element.devic_info_id;
//         // if (volt_battery >= 8 && volt_battery <= 10) {
//         //   db.query(`INSERT INTO notifision_table (notification_status, hardware, alert_cause, devic_infoDB_devic_info_id) VALUES (?, ?, ?, ?);`,
//         //     ['moderate', 'แบตเตอร์รี่', 'แบตเตอรี่เริ่มไม่ชาร์จไฟ', devic_info_id],
//         //     (err, result) => {
//         //       if (err) throw res.send(err);
//         //       next()
//         //     })
//         // }
//         // else if (volt_battery < 8) {
//         //   let sql = `select 
//         //   idnotifision_table,devicname,notification_status 
//         //   ,hardware,alert_cause,timecreate,revisiondate
//         //   from devic_infoDB 
//         //   inner join notifision_table on devic_infoDB.devic_info_id = notifision_table.devic_infoDB_devic_info_id
//         //   where devicname = '${devicname}' 
//         //   and notification_status = 'critical'  
//         //   and hardware= 'แบตเตอร์รี่' and   
//         //   idnotifision_table = (
//         //   select max(idnotifision_table) from notifision_table where devic_infoDB_devic_info_id = ${devic_info_id} and  notification_status = 'critical' and hardware = 'แบตเตอร์รี่'
//         //   );
//         //  `
//         //   db.query(sql, (err, result) => {
//         //     if (err) throw res.send(err);

//         //     if (result.length > 0) {
//         //       result.forEach(element => {
//         //         console.log(element);
//         //         if (element.revisiondate === null) {
//         //           next()
//         //         }
//         //         else {
//         //           db.query(`INSERT INTO notifision_table (notification_status, hardware, alert_cause, devic_infoDB_devic_info_id) VALUES (?, ?, ?, ?);`,
//         //             ['critical', 'แบตเตอร์รี่', 'ไม่สามารถใช้การได้', devic_info_id],
//         //             (err, result) => {
//         //               if (err) throw res.send(err);
//         //               next()
//         //             })
//         //         }
//         //       });
//         //     }
//         //     else {
//         //       db.query(`INSERT INTO notifision_table (notification_status, hardware, alert_cause, devic_infoDB_devic_info_id) VALUES (?, ?, ?, ?);`,
//         //         ['critical', 'แบตเตอร์รี่', 'ไม่สามารถใช้การได้', devic_info_id],
//         //         (err, result) => {
//         //           if (err) throw res.send(err);
//         //           next()
//         //         })
//         //     }
//         //   });
//         // }
//         // else {
//         //   next()
//         // }


//         // ************************************************************
//         // หลอดไฟแอลอีดี                                                  
//         // ************************************************************
//         db.query(`select devicname,compary,maximumpower,voltage from devic_infoDB  inner join Productdevic 
//         on devic_infoDB.Productdevic_idtable1 = Productdevic.idtable1
//         inner join ProductBrand_lde 
//         on  ProductBrand_lde.idtable1 =  Productdevic.ProductBrand_lde_idtable1 where devicname = '${devicname}';
//         `, (err, result) => {
//           if (err) throw console.log(err);;
//           // res.result(result);
//           console.log(result);
//           let watt_maximumpower = result[0].maximumpower;
//           let voltage = result[0].voltage;
//           let watt_led = lib.ledwatt_hout(volt_led, voltage, watt_maximumpower);
//           let time = new Date().getHours();

//           console.log(watt_led);

//           if (watt_led == 0 && time >= 14) {
//             console.log('led critical');
//             db.query(`select * from notifision_table where devic_infoDB_devic_info_id = ${devic_info_id} 
//              and	 idnotifision_table = (select max(idnotifision_table) 
//             from notifision_table
//             where devic_infoDB_devic_info_id = ${devic_info_id} and hardware = 'หลออดไฟแอลอีดี' and notification_status = 'critical');`
//               , (err, result) => {
//                 if (result.length > 0) {
//                   if (err) throw console.log(err);
//                   console.log(result[0].revisiondate);
//                   if (result[0].revisiondate === null) {
//                     next();
//                   }
//                   else {
//                     db.query(`insert into 
//                   notifision_table(notification_status,hardware,alert_cause,devic_infoDB_devic_info_id)
//                   value('critical','หลออดไฟแอลอีดี','ไม่สามารถใช้การได้',${devic_info_id});`, (err, result) => {
//                       if (err) throw console.log(err);
//                       next();
//                     });
//                   }
//                 }
//                 else {
//                   db.query(`insert into 
//                   notifision_table(notification_status,hardware,alert_cause,devic_infoDB_devic_info_id)
//                   value('critical','หลออดไฟแอลอีดี','ไม่สามารถใช้การได้',${devic_info_id});`, (err, result) => {
//                     if (err) throw console.log(err);
//                     next();
//                   });
//                 }
//               });
//           }
//           else if (watt_led <= (watt_maximumpower / 2) && time >= 14) {
//             console.log('led moderate');
//             db.query(`select * from notifision_table where devic_infoDB_devic_info_id = ${devic_info_id} 
//             and	 idnotifision_table = (select max(idnotifision_table) 
//            from notifision_table
//            where devic_infoDB_devic_info_id = ${devic_info_id} and hardware = 'หลออดไฟแอลอีดี' and notification_status = 'critical');`
//               , (err, result) => {
//                 if (result.length > 0) {
//                   if (err) throw console.log(err);
//                   console.log(result[0].revisiondate);
//                   if (result[0].revisiondate === null) {
//                     next();
//                   }
//                   else {
//                     db.query(`insert into 
//                  notifision_table(notification_status,hardware,alert_cause,devic_infoDB_devic_info_id)
//                  value('moderate','หลออดไฟแอลอีดี','หลอดไฟแอลอีดีเริ่มเสื่อมสภาพ',${devic_info_id});`, (err, result) => {
//                       if (err) throw console.log(err);
//                       next();
//                     });
//                   }
//                 }
//                 else {
//                   db.query(`insert into 
//                  notifision_table(notification_status,hardware,alert_cause,devic_infoDB_devic_info_id)
//                  value('moderate','หลออดไฟแอลอีดี','หลอดไฟแอลอีดีเริ่มเสื่อมสภาพ',${devic_info_id});`, (err, result) => {
//                     if (err) throw console.log(err);
//                     next();
//                   });
//                 }
//               });
//           }

//           // console.log(watt_led);
//           // console.log(watt_led);
//           // console.log();
//           // console.log(watt_led);
//           // console.log(watt_maximumpower);

//         })

//       });
//     }
//     else {
//       next()
//     }
//   });
// }



// การเพิ่มข้อมูลจาก NB IOT 
// module.exports.poststackNB = async (req, res, next) => {
//   console.log(req.body);
//   let devicname = req.body.devicname;
//   let volt_solar = req.body.volt_solar;
//   let volt_battery = req.body.volt_battery;
//   let volt_led = req.body.volt_led;
//   let temperature = req.body.temperature;
//   let humidity = req.body.humidity;
//   let temperatureCPU = req.body.temperatureCPU;
//   let light = req.body.light;

//   let devic_info_id;
//   let sql = `select devic_info_id,devicname from devic_infoDB where devicname = ?;`;
//   db.query(sql, [devicname], (err, result) => {
//     if (err) throw res.send(err);
//     if (result.length > 0) {
//       result.forEach((element) => {
//         devic_info_id = element.devic_info_id;
//         sql = `select devic_info_id,devicname from devic_infoDB where devic_info_id = '${element.devic_info_id}';`;
//       });
//       db.query(sql, (err, result) => {
//         if (err) throw res.send(err);
//         if (result.length > 0) {
//           db.query(
//             "INSERT INTO dbr_solar (volt_solar, volt_battery, volt_led, temperature, humidity, temperatureCPU, light ,devicname_devic_info_id) VALUES (?,?,?,?,?,?,?,?)",
//             [
//               volt_solar,
//               volt_battery,
//               volt_led,
//               temperature,
//               humidity,
//               temperatureCPU,
//               light,
//               devic_info_id,
//             ],
//             (err, result) => {
//               if (err) throw res.send(err);

//               res.send(result);
//             }
//           );
//         }
//       });
//     } else {
//       res.send("no devicname ");
//     }
//   });
// };



module.exports.poststackNB = async (req, res) => {
  console.log(req.body);
  //  NB Post data solarstrelight
  let devicname = req.body.devicname;
  let volt_solar = req.body.volt_solar;
  let volt_battery = req.body.volt_battery;
  let volt_led = req.body.volt_led;
  let temperature = req.body.temperature;
  let humidity = req.body.humidity;
  let temperatureCPU = req.body.temperatureCPU;
  let light = req.body.light;

  //  volt_working no-off product
  let devic_info_id = null;
  let volt_workingon_led = null;
  let volt_workingoff_led = null;
  let volt_workingon_solar = null;
  let volt_workingoff_solar = null;
  let volt_workingon_battery = null;
  let volt_workingoff_battery = null;

  //  status devicdata  
  let status_battery = null;
  let status_solar = null;
  let status_led = null;

  let sql = `  select devic_info_id ,devicname, latitude,longitude ,volt_workingon_led,volt_workingoff_led,volt_workingon_solar
  ,volt_workingoff_solar,volt_workingon_battery,volt_workingoff_battery,volt_workingon_batterydeteriorated  
  from devic_infoDB inner join Productdevic on 
  devic_infoDB.Productdevic_idtable1 = Productdevic.idtable1
  inner join ProductBrand_lde on Productdevic.ProductBrand_lde_idtable1 = ProductBrand_lde.idtable1
  inner join ProductBrand_solar on Productdevic.ProductBrand_solar_idtable1 = ProductBrand_solar.idtable1
  inner join ProductBrand_Battery on Productdevic.ProductBrand_Battery_idtable1 = ProductBrand_Battery.idtable1
  where devicname  = '${devicname}';`

  db.query(sql, (err, result) => {
    if (err) throw console.log(err);
    console.log(result);
    console.log(result);
    // volt_workingon_led = result[0].volt_workingon_led;
    // volt_workingoff_solar = result[0].volt_workingoff_solar;
    // volt_workingoff_battery = result[0].volt_workingoff_battery;

    devic_info_id = result[0].devic_info_id;
    volt_workingoff_led = result[0].volt_workingoff_led;
    volt_workingon_solar = result[0].volt_workingon_solar;
    volt_workingon_battery = result[0].volt_workingon_battery;
    volt_batterydeteriorated = result[0].volt_workingon_batterydeteriorated;

    status_led = lib.statusworkingon_led(volt_led, volt_workingoff_led);
    status_battery = lib.statusworkingon_battery(volt_battery, volt_workingon_battery);
    status_solar = lib.statusworkingon_solar(volt_solar, volt_workingon_solar);
    // console.log(status_led,status_battery,status_solar);




    notification.led_notification(status_led,status_solar,volt_battery,devic_info_id);
    notification.batterydata__notification(volt_battery,volt_batterydeteriorated ,volt_workingon_battery,devic_info_id);




    // console.log(result);
    // res.json(result)
    db.query('INSERT INTO volt_batterydata (volt_battery,status_battery,devic_infoDB_devic_info_id) VALUES (?,?,?);', [volt_battery, status_battery, devic_info_id], (err, result) => {
      if (err) throw console.log(err);
      db.query('INSERT INTO volt_leddata (volt_led,status_led,devic_infoDB_devic_info_id) VALUES (?,?,?);', [volt_led, status_led, devic_info_id], (err, result) => {
        if (err) throw console.log(err);
        db.query('INSERT INTO volt_solardata (volt_solar,status_solar,devic_infoDB_devic_info_id) VALUES (?,?,?);', [volt_solar, status_solar, devic_info_id], (err, result) => {
          if (err) throw console.log(err);
          res.send(result);
        });
      });
    })
  });
}



module.exports.insertwatthout = () => {
  // let id = 1;
  db.query("SELECT * FROM devic_infoDB;", (err, result) => {
    if (err) throw console.log(err);
    result.forEach((devic) => {
      let sqlqurey = `select devicname ,solar_watt_hour ,battery_watt_hour,led_watt_hour,time_updated from devic_infoDB
      inner join  watt_hour on devic_infoDB.devic_info_id  = watt_hour.devic_infoDB_devic_info_id
      where devicname = '${devic.devicname}' and
      watt_hour.idwatt_hour = (
      select max(idwatt_hour) from watt_hour
      inner join  devic_infoDB on
      devic_infoDB.devic_info_id  = watt_hour.devic_infoDB_devic_info_id
      where devic_infoDB.devicname = '${devic.devicname}'
      );`;
      db.query(sqlqurey, (err, result) => {
        if (err) throw console.log(err);
        if (result.length > 0) {
          let sqlqurey = `select devicname ,sum(volt_solar)/count(id)volt_solar_hout   ,sum(volt_battery)/count(id)volt_battery_hout ,sum(volt_led)/count(id)volt_led_hout ,dbr_solar.devicname_devic_info_id   from dbr_solar 
          inner join devic_infoDB on devic_infoDB.devic_info_id = dbr_solar.devicname_devic_info_id
          where devicname = '${devic.devicname}'  
          and dbr_solar.devicname_devic_info_id =  (select devic_info_id from devic_infoDB where devicname =  '${devic.devicname}')
          and time_updated between  (select max(time_updated) from watt_hour  where devic_infoDB_devic_info_id = '${devic.devic_info_id}') and now()
          group by devicname_devic_info_id;`;

          db.query(sqlqurey, (err, result) => {
            if (err) throw console.log(err);
            if (result.length > 0) {
              console.log(result);
              result.forEach((devichout) => {
                let volt_solar_hout = devichout.volt_solar_hout;
                let volt_battery_hout = devichout.volt_battery_hout;
                let volt_led_hout = devichout.volt_led_hout;

                if (
                  (volt_solar_hout, volt_battery_hout, volt_led_hout === null)
                ) {
                  console.log(
                    "devicname_watthouts " + devic.devicname,
                    ":",
                    "losdata"
                  );
                } else {
                  let sqlquery = `SELECT devicname,Productdeviccol_name ,
                  (ProductBrand_solar.maximumpower)solar_maximumpower ,
                  (ProductBrand_Battery.batterycapacity)batterycapacity,
                  (ProductBrand_lde.maximumpower)LED_maximumpower,
                  (ProductBrand_solar.voltage)solar_voltage,
                  (ProductBrand_lde.voltage)LED_voltage
                  FROM devic_infoDB
                  inner join  Productdevic on devic_infoDB.Productdevic_idtable1 = Productdevic.idtable1
                  inner join  ProductBrand_solar on  Productdevic.ProductBrand_solar_idtable1 = ProductBrand_solar.idtable1
                  inner join  ProductBrand_lde on  Productdevic.ProductBrand_lde_idtable1 = ProductBrand_lde.idtable1
                  inner join  ProductBrand_Battery on  Productdevic.ProductBrand_Battery_idtable1 = ProductBrand_Battery.idtable1
                  where devicname = '${devic.devicname}';
                  
                  `;

                  db.query(sqlquery, (err, result) => {
                    if (err) throw console.log(err);
                    result.forEach((Productdeviccol) => {
                      console.log(Productdeviccol);
                      console.log(
                        lib.solarwatt_hout(
                          volt_solar_hout,
                          Productdeviccol.solar_voltage,
                          Productdeviccol.solar_maximumpower
                        )
                      );
                      console.log(
                        lib.ledwatt_hout(
                          volt_led_hout,
                          Productdeviccol.LED_maximumpower,
                          Productdeviccol.LED_voltage
                        )
                      );
                      console.log(
                        lib.batterycapacity(
                          volt_battery_hout,
                          Productdeviccol.batterycapacity
                        )
                      );

                      db.query(
                        "INSERT INTO watt_hour (solar_watt_hour, battery_watt_hour, led_watt_hour, devic_infoDB_devic_info_id) VALUES (?,?,?,?);",
                        [
                          lib.solarwatt_hout(
                            volt_solar_hout,
                            Productdeviccol.solar_voltage,
                            Productdeviccol.solar_maximumpower
                          ),
                          lib.batterycapacity(
                            volt_battery_hout,
                            Productdeviccol.batterycapacity
                          ),
                          lib.ledwatt_hout(
                            volt_led_hout,
                            Productdeviccol.LED_maximumpower,
                            Productdeviccol.LED_voltage
                          ),
                          devic.devic_info_id,
                        ],
                        (err, result) => {
                          if (err) throw console.log(err);
                          console.log("INSERT watt_hout");
                        }
                      );
                    });
                  });
                }
              });
            } else {
              console.log(
                "devicname_watthouts " + devic.devicname,
                ":",
                "losdata"
              );
            }
          });
        } else {
          let sqlquery = `select devicname , 
                          sum(volt_solar)/count(id)volt_solarAvg,
                          sum(volt_battery)/count(id)volt_batteryAvg,
                          sum(volt_led)/count(id)volt_ledAvg
                          from dbr_solar 
                          inner join devic_infoDB on devic_infoDB.devic_info_id = dbr_solar.devicname_devic_info_id 
                          where devicname = '${devic.devicname}' and time_updated 
                          between  (select min(time_updated) from dbr_solar  where devicname_devic_info_id = '${devic.devic_info_id}'  ) and now()
                          group by devicname;`;
          db.query(sqlquery, (err, result) => {
            // console.log(result);
            if (err) throw console.log(err);
            if (result.length > 0) {
              console.log(result);
              result.forEach((element) => {
                // let devicname = element.devicname;
                let volt_solar_hout = element.volt_solarAvg;
                let volt_battery_hout = element.volt_batteryAvg;
                let volt_led_hout = element.volt_ledAvg;
                let devicname_devic_info_id = element.devicname_devic_info_id;

                let sqlqueryproduct = `SELECT devicname,Productdeviccol_name ,
                (ProductBrand_solar.maximumpower)solar_maximumpower ,
                (ProductBrand_Battery.batterycapacity)batterycapacity,
                (ProductBrand_lde.maximumpower)LED_maximumpower,
                (ProductBrand_solar.voltage)solar_voltage,
                (ProductBrand_lde.voltage)LED_voltage
                FROM devic_infoDB
                inner join  Productdevic on devic_infoDB.Productdevic_idtable1 = Productdevic.idtable1
                inner join  ProductBrand_solar on  Productdevic.ProductBrand_solar_idtable1 = ProductBrand_solar.idtable1
                inner join  ProductBrand_lde on  Productdevic.ProductBrand_lde_idtable1 = ProductBrand_lde.idtable1
                inner join  ProductBrand_Battery on  Productdevic.ProductBrand_Battery_idtable1 = ProductBrand_Battery.idtable1
                where devicname = '${devic.devicname}';`;

                // let volt_solar_hout = devichout.volt_solar_hout;
                // let volt_battery_hout = devichout.volt_battery_hout;
                // let volt_led_hout = devichout.volt_led_hout;
                db.query(sqlqueryproduct, (err, result) => {
                  if (err) throw console.log(err);
                  result.forEach((Productdeviccol) => {
                    console.log(Productdeviccol);
                    console.log(
                      lib.solarwatt_hout(
                        volt_solar_hout,
                        Productdeviccol.solar_voltage,
                        Productdeviccol.solar_maximumpower
                      )
                    );
                    console.log(
                      lib.ledwatt_hout(
                        volt_led_hout,
                        Productdeviccol.LED_maximumpower
                      )
                    );
                    console.log(
                      lib.batterycapacity(
                        volt_led_hout,
                        Productdeviccol.LED_voltage,
                        Productdeviccol.batterycapacity
                      )
                    );

                    db.query(
                      "INSERT INTO watt_hour (solar_watt_hour, battery_watt_hour, led_watt_hour, devic_infoDB_devic_info_id) VALUES (?,?,?,?);",
                      [
                        lib.solarwatt_hout(
                          volt_solar_hout,
                          Productdeviccol.solar_voltage,
                          Productdeviccol.solar_maximumpower
                        ),
                        lib.batterycapacity(
                          volt_battery_hout,
                          Productdeviccol.batterycapacity
                        ),
                        lib.ledwatt_hout(
                          volt_led_hout,
                          Productdeviccol.LED_voltage,
                          Productdeviccol.LED_maximumpower
                        ),
                        devic.devic_info_id,
                      ],
                      (err, result) => {
                        if (err) throw console.log(err);
                        console.log("INSERT watt_hout");
                      }
                    );
                  });
                });
              });
            } else {
              console.log("devicname " + devic.devicname, ":", "losdata");
            }
          });
        }
      });
    });
    //  id = 0;
  });
};

module.exports.solarstreetlight_information = async (req, res) => {
  // console.log(req.params.devicname);
  let devicname = req.params.devicname;
  let sql = `select devicname,
  sum(solar_watt_hour)sumwattsolar ,sum(battery_watt_hour)sumwattbattery, sum(led_watt_hour)sumwattled , count(idwatt_hour)hout
  ,latitude,longitude ,Productdeviccol_name  ,model,voltage,maximumpower 
  from  devic_infoDB   inner join
  Productdevic on devic_infoDB.Productdevic_idtable1 = Productdevic.idtable1
  inner join ProductBrand_solar 
  on Productdevic.ProductBrand_solar_idtable1  =ProductBrand_solar.idtable1
  inner join watt_hour on devic_infoDB.devic_info_id  = watt_hour.devic_infoDB_devic_info_id
  where devicname ='${devicname}' GROUP BY devicname,latitude,longitude ,
  Productdeviccol_name ,model,voltage,maximumpower ;`;

  db.query(sql, (err, result) => {
    if (err) throw console.log(err);
    res.send(result);
  });
};

module.exports.ProductBrand_Battery = async (req, res) => {
  // console.log(req.params.devicname);
  let devicname = req.params.devicname;
  let sql = `select devicname,
  sum(battery_watt_hour)sumwattbattery, count(idwatt_hour)hout
  ,latitude,longitude ,Productdeviccol_name  ,model,voltage,batterycapacity 
  from  devic_infoDB   inner join
  Productdevic on devic_infoDB.Productdevic_idtable1 = Productdevic.idtable1
  inner join ProductBrand_Battery 
  on Productdevic.ProductBrand_Battery_idtable1  =ProductBrand_Battery.idtable1
  inner join watt_hour on devic_infoDB.devic_info_id  = watt_hour.devic_infoDB_devic_info_id
  where devicname ='${devicname}' GROUP BY devicname,latitude,longitude ,
  Productdeviccol_name ,model,voltage,batterycapacity ;
  `;

  db.query(sql, (err, result) => {
    if (err) throw console.log(err);
    res.send(result);
  });
};

module.exports.ProductBrand_lde = async (req, res) => {
  // console.log(req.params.devicname);
  let devicname = req.params.devicname;
  let sql = `select devicname,
  sum(led_watt_hour)sumwattled, count(idwatt_hour)hout
  ,latitude,longitude ,Productdeviccol_name  ,model,maximumpower 
  from  devic_infoDB   inner join
  Productdevic on devic_infoDB.Productdevic_idtable1 = Productdevic.idtable1
  inner join ProductBrand_lde 
  on Productdevic.ProductBrand_lde_idtable1  =ProductBrand_lde.idtable1
  inner join watt_hour on devic_infoDB.devic_info_id  = watt_hour.devic_infoDB_devic_info_id
  where devicname ='${devicname}' GROUP BY devicname,latitude,longitude ,
  Productdeviccol_name ,model,maximumpower ;
  `;

  db.query(sql, (err, result) => {
    if (err) throw console.log(err);
    res.send(result);
  });
};

module.exports.sumprojact = async (req, res) => {
  // console.log(req.params.devicname);
  let projactname = req.params.projactname;
  let sql = `select Projact_name ,place , sum(solar_watt_hour)sumsolar_projact 
  ,sum(battery_watt_hour)sumbattery_projact ,sum(led_watt_hour)sumled_projact  from Project_table  
  inner join token_table on Project_table.idtable1 = token_table.Project_table_idtable1
  inner join devic_infoDB on devic_infoDB.token_table_token_id = token_table.token_id
  inner join watt_hour on devic_infoDB.devic_info_id = watt_hour.devic_infoDB_devic_info_id 
  where Projact_name = '${projactname}' group by Projact_name;
  `;
  db.query(sql, (err, result) => {
    if (err) throw console.log(err);
    res.send(result);
  });
};


// อ่านค่าการแจ้งเตือน 
module.exports.notification_information = async (req, res) => {
  let username = req.params.username;
  // console.log(username);
  // let devicname = req.body.devicname;
  let sqlquery = `select idnotification, username,Projact_name,place,devicname,notification_status,hardware
    ,alert_cause,notification_table.timecreate,revisiondate , status_read from users 
    inner join Project_table on users.users_id = Project_table.user_users_id
    inner join token_table on Project_table.idtable1 = token_table.Project_table_idtable1
    inner join devic_infoDB on token_table.token_id = devic_infoDB.token_table_token_id
    inner join notification_table on devic_infoDB.devic_info_id = notification_table.devic_infoDB_devic_info_id 
    where username = '${username}' order by timecreate desc;`
  db.query(sqlquery, (err, result) => {
    if (err) throw console.log(err);
    res.send(result);
  });
}







module.exports.notification_information_battery = async (req, res) => {
  let username = req.params.username;
  console.log(username);
  // let devicname = req.body.devicname;
  let sqlquery = `  select username,Projact_name,place,devicname,notification_status,hardware
  ,alert_cause,notifision_table.timecreate,revisiondate from users 
  inner join Project_table on users.users_id = Project_table.user_users_id
  inner join token_table on Project_table.idtable1 = token_table.Project_table_idtable1
  inner join devic_infoDB on token_table.token_id = devic_infoDB.token_table_token_id
  inner join notifision_table on devic_infoDB.devic_info_id = notifision_table.devic_infoDB_devic_info_id
  where username = '${username}' and hardware ='แบตเตอร์รี่' ;`
  db.query(sqlquery, (err, result) => {
    if (err) throw console.log(err);
    res.send(result);
  });
}


module.exports.notification_status_read = async(req,res) => {

  console.log(req.body.username);
  let sqlquery = `select idnotification, username,Projact_name,place,devicname,notification_status,hardware
  ,alert_cause,notification_table.timecreate,revisiondate , status_read from users 
  inner join Project_table on users.users_id = Project_table.user_users_id
  inner join token_table on Project_table.idtable1 = token_table.Project_table_idtable1
  inner join devic_infoDB on token_table.token_id = devic_infoDB.token_table_token_id
  inner join notification_table on devic_infoDB.devic_info_id = notification_table.devic_infoDB_devic_info_id 
  where username = '${req.body.username}' and status_read = 0 order by timecreate desc;`
  db.query(sqlquery, (err, result) => {
    if (err) throw console.log(err);
    // res.send(result);
    // console.log(result);
    if (result.length > 0) {
          result.forEach(data => {
        let status_read = data.status_read;
        let id = data.idnotification
        console.log(data.status_read);
        if (data.status_read === 0) {
          db.query(`UPDATE notification_table SET status_read = '1' WHERE (idnotification = '${id}');`, (err, result) => {
            if (err) throw console.log(err);
            console.log(result);
          })
        }
    });
    } else {
      res.send("no notification ");
    }

    // UPDATE `solar_lightDB5`.`notification_table` SET `status_read` = '0' WHERE (`idnotification` = '4');


  });
}


module.exports.latest_notification = async(req, res) => {
  let username = req.params.username;

  let sqlquery = `select  count(*)notification from users 
  inner join Project_table on users.users_id = Project_table.user_users_id
  inner join token_table on Project_table.idtable1 = token_table.Project_table_idtable1
  inner join devic_infoDB on token_table.token_id = devic_infoDB.token_table_token_id
  inner join notification_table on devic_infoDB.devic_info_id = notification_table.devic_infoDB_devic_info_id 
  where username = '${username}' and status_read = 0;`
  db.query(sqlquery, (err, result) => {
    if (err) throw console.log(err);
    res.send(result);
  });
}

