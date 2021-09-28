var express = require('express');
var router = express.Router();


router.post('/post_data', async function(req, res, next) {
  var device_hash = req.body.device_hash
  var time = Math.floor(+new Date() / 1000)
  //var time_id = await helper.notRedundantTimestamp(time)


  var device = await conn.query("SELECT * FROM device WHERE placeholder = ?;",[device_hash])
  if(device.length == 0){
    res.send({msg: "device not found", error: true});
    return 
  }

  await conn.query("INSERT INTO measurement(timestamp,device,co2,temp,pressure,humidity,iaq) VALUES(?,?,?,?,?,?,?);",[time,device[0]['id'],req.body.co2,req.body.temp,req.body.pressure,req.body.humidity,req.body.iaq])
  res.send({msg: "sucessfully added data"});
});

module.exports = router;
