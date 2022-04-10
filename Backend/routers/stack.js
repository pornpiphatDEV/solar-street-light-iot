let express = require("express");
let cors = require("cors");
let router = express.Router();
let stackinformation  = require("../controllers/Stackinformation");
let bodyParser = require("body-parser");


let jwt = require("jsonwebtoken");
let passport = require("passport");


// ------------------------------------------------------------------------------
router.use(cors());
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/test01' , stackinformation.teststack);
router.get('/getwatthout/:devicname',stackinformation.getwatthout);

// router.use('/poststack',stackinformation.notification );
router.post('/poststack',stackinformation.poststackNB );

router.get('/getsolarstreetlight/:devicname',stackinformation.solarstreetlight_information);
router.get('/productBattery/:devicname',stackinformation.ProductBrand_Battery);
router.get('/ProductBrand_lde/:devicname',stackinformation.ProductBrand_lde);

router.get('/projactsum/:projactname',stackinformation.sumprojact);

router.get('/notification_information/:username',stackinformation.notification_information);
router.get('/notification_information/:username',stackinformation.notification_information_battery);

router.get('/latest_notification/:username',stackinformation.latest_notification);
router.post('/notification_statusread',stackinformation.notification_status_read);               
// setInterval(stackinformation.insertwatthout, 60000*60);
// setInterval(stackinformation.insertwatthout, 60000);
// setTimeout(stackinformation.insertwatthout, 1000);


module.exports =router;