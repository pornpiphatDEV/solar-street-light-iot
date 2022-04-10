let express = require("express");
let mysql = require("mysql");
let db = require("../config/config").db;


// if (status_led == 0 && status_solar == 0) {
//     console.log('หลอดไฟเสีย');


//   }


module.exports.led_notification = (status_led, status_solar, volt_battery, id) => {
    console.log(status_led);
    console.log(status_solar);

    console.log(id);
    console.log(volt_battery);
    if (status_led == 0 && status_solar == 0 && volt_battery > 0) {
        console.log('หลอดไฟเสีย');
        db.query(`select * from notification_table where devic_infoDB_devic_info_id = ${id} 
        and	 idnotification = (select max(idnotification) 
        from notification_table
        where devic_infoDB_devic_info_id = ${id} and hardware = 'หลอดไฟแอลอีดี' and notification_status = 'critical');`
            , (err, result) => {
                if (result.length > 0) {
                    if (err) throw console.log(err);
                    console.log(result[0].revisiondate);
                    if (result[0].revisiondate === null) {
                        console.log("ยังไม่ทำการแก้ไข");
                    }
                    else {
                        db.query(' INSERT INTO  notification_table (notification_status, hardware, alert_cause, status_read, devic_infoDB_devic_info_id) VALUES(?,?,?,?,? )', [
                            "critical",
                            "หลอดไฟแอลอีดี",
                            "ใช้งานไม่ได้",
                            0,
                            id
                        ], (err, result) => {
                            if (err) throw console.log(err);
                            console.log(result);
                        });
                    }
                } else {
                    db.query(' INSERT INTO  notification_table (notification_status, hardware, alert_cause, status_read, devic_infoDB_devic_info_id) VALUES(?,?,?,?,? )', [
                        "critical",
                        "หลอดไฟแอลอีดี",
                        "ใช้งานไม่ได้",
                        0,
                        id
                    ], (err, result) => {
                        if (err) throw console.log(err);
                        console.log(result);
                    });
                }
            })
    }
}


module.exports.batterydata__notification = (volt_battery, volt_batterydeteriorated, volt_workingon_battery, id) => {
    console.log(volt_battery);
    console.log(volt_batterydeteriorated);
    console.log(volt_workingon_battery);

    if (volt_battery >= volt_batterydeteriorated && volt_battery < volt_workingon_battery) {
        console.log("แบตเริ่มเสื่อม");
        db.query(' INSERT INTO  notification_table (notification_status, hardware, alert_cause, status_read, devic_infoDB_devic_info_id) VALUES(?,?,?,?,? )', [
            'moderate', 'แบตเตอร์รี่', 'แบตเตอรี่เริ่มไม่ชาร์จไฟ',
            0,
            id
        ], (err, result) => {
            if (err) throw console.log(err);
            console.log(result);
        });
    }
    else if (volt_battery < volt_batterydeteriorated) {
        console.log('แบตเตอร์รี่ ใช้งานไม่ได้');
    }





}
