




module.exports.statusworkingon_led = (v, v_off) => {
  let status;
  if (v < v_off) {
    status = 1;
  }
  else {
    status = 0
  }
  return status;

}

module.exports.statusworkingon_battery = (v, v_off) => {
  let status;
  if (v < v_off) {
    status = 0;
  }
  else {
    status = 1
  }
  return status;
}


module.exports.statusworkingon_solar = (v, v_off) => {
  let status;
  if (v < v_off) {
    status = 0;
  }
  else {
    status = 1
  }
  return status;
}








// ฟั่งชั่นการคำนวน
module.exports.solarwatt_hout = (value, volt, wart) => {
  return ((wart / volt) * value).toFixed(2);
};

module.exports.ledwatt_hout = (value, volt, wart) => {
  return ((wart / volt) * value).toFixed(2);
};

module.exports.batterycapacity = (value, capacity) => {
  return (value * capacity).toFixed(2);
}
