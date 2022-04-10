let express = require("express");
let cors = require("cors");
let router = express.Router();
let usercontrollers  = require("../controllers/usercontrollers");
let bodyParser = require("body-parser");


let jwt = require("jsonwebtoken");
let passport = require("passport");

// ------------------------------------------------------------------------------
router.use(cors());
router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));




router.get('/test01' , usercontrollers.test);
router.post('/singup',usercontrollers.singup );
router.post('/login' ,usercontrollers.login);
router.post('/acceptpolicy',usercontrollers.acceptpolicy);
router.get('/imagesprofile/:user',usercontrollers.profile);
router.get('/listprojact/:user',usercontrollers.listprojact);
router.get('/getdevicilst/:projactname' ,usercontrollers.listdevic);
router.post('/changeaccountname',usercontrollers.changeaccountname);
router.post('/changepassword',usercontrollers.changepassword);


module.exports =router;