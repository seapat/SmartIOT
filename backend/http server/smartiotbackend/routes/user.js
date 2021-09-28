var express = require('express');
var router = express.Router();
var salt = "=)(/&%$ERTDFGHJKLJjshjÄ.!&/("

router.get('/', async function(req, res, next) {
  res.send({"running":true})
})

router.post('/register_user', async function(req, res, next) {
  var username = req.body.username
  console.log(req.body)
  var password = helper.generateSHA256(req.body.password+salt) // sha256(string + salt)
  var time = Math.floor(+new Date() / 1000)
  var time_id = await helper.notRedundantTimestamp(time)

  var myres = await conn.query("SELECT * FROM user WHERE username = ?;",[username])
  if(myres.length > 0){
    res.send({msg: "user already exists",error: true});
    return
  }
  await conn.query("INSERT INTO user(username,password,creation) VALUES(?,?,?);",[username,password,time_id])
  var myres = await conn.query("SELECT * FROM user WHERE username = ?;",[username])

  res.send({msg: "sucessfully added user","id":myres[0]['id']});
});

router.post('/register_device', async function(req, res, next) {
  //var device_id = req.body.device_id
  var device_hash = req.body.device_hash // is it actually needed !? 
  //var user_id = req.body.user_id 

  var session_id = req.body.session_id

  var user = await conn.query("SELECT * FROM session WHERE hash = ?;",[session_id])
  if(user.length == 0){
    res.send({msg: "not a valid session",error:true});
    return
  }

  var time = Math.floor(+new Date() / 1000)
  var device = await conn.query("SELECT * FROM device WHERE placeholder = ?;",[device_hash])
  if(device.length>0){
    res.send({msg: '"random hash" already exists. Please generate a different one.',error: true});
    return
  }

  await conn.query("INSERT INTO device(placeholder) VALUES(?);",[device_hash])
  var device = await conn.query("SELECT * FROM device WHERE placeholder = ?;",[device_hash]) //get it again to get the id
  await conn.query("INSERT INTO ownership(device,user)VALUES(?,?)",[device[0]['id'],user[0]['id']])

  res.send({msg: "sucessfully added device"});
});

router.post('/login', async function(req, res, next) { //always generate new session
  var username = req.body.username
  var password = helper.generateSHA256(req.body.password+salt) // sha256(string + salt)
  var user = await conn.query("SELECT * FROM user WHERE username = ? AND password = ?;",[username,password])
  if(user.length == 0){
    res.send({msg: 'wrong username or password',error: true});
    return
  }

  var time = await helper.notRedundantTimestamp(helper.getTimestamp())

  var random_nounce = helper.generateSeed()
  await conn.query("INSERT INTO session(timestamp,user,hash) VALUES(?,?,?);",[time,user[0]['id'],random_nounce])
  res.send({msg: random_nounce});

})

router.post('/get_data', async function(req, res, next) { 
  //its just returning all data... maybe we need measurement type
  var session_id = req.body.session_id //we could also use a http header, but this is probably easier to understand 
  var valid = await helper.login(session_id)
  if(!valid[0]){
    res.send({msg: "no auth",error:true});
    return
  }
  var authed = valid[1]
  var count = req.body.count //limit number of entries we want to fetch

  if((typeof count) == 'undefined'){
    count = 1000 // always limit to last 1000 entries (we might need to change that)
  }

  var user_id = authed[0]['user']

  var devices = await conn.query("SELECT * FROM ownership WHERE user = ?",[user_id])
  console.log(devices)
  var all_measurements = {}
  for(var i in devices){ //iterate over all devices
    var device = devices[i]
    var device_id = device['id']
    var measurements = await conn.query("SELECT * FROM measurement WHERE device = ? ORDER BY timestamp DESC LIMIT ?;",[device_id,count])
    // for(var m in measurements){
    //   var mes = measurements[m]
    //   var time_stamp_id = mes.timestamp
    //   var real_time = await conn.query("SELECT timestamp FROM timestamp WHERE id = ?;",[time_stamp_id])
    //   mes.timestamp = real_time[0]['timestamp']
    // }
    all_measurements[device_id] = measurements
  }
  res.send({msg: all_measurements})

})


router.post('/get_stats', async function(req, res, next) { 
  var session_id = req.body.session_id
  var device_hash = req.body.device_hash

  var valid = await helper.login(session_id)
  if(!valid[0]){
    res.send({msg: "no auth",error:true});
    return
  }
  var authed = valid[1]


  var time_range = req.body.time_range // time range in seconds e.g. 120 meaning that all points > from time.now-120 will be shown
  var current_time = await helper.getTimestamp()
  
  var until_time = current_time-time_range

  
  var device = await conn.query("SELECT * FROM device WHERE placeholder = ?;",[device_hash])
  if(device.length == 0){
    res.send({msg: "device not found",error:true});
    return
  }
  var device_id = device[0]['id']

  var devices = await conn.query("SELECT * FROM ownership WHERE user = ? AND device = ?;",[authed[0]['user'],device_id])
  if(devices.length == 0){
    res.send({msg: "no auth for this device",error:true});
    return
  }


  //TODO: implement median, NEED TO INCREASE PREFORMANCE

  var measurements = await conn.query("SELECT * FROM measurement WHERE device = ? ORDER BY id DESC LIMIT 10000;",[device_id])
  var data = {co2:{data:[],stats:{}},temp:{data:[],stats:{}},pressure:{data:[],stats:{}},humidity:{data:[],stats:{}},iaq:{data:[],stats:{}}}
  var data_points = ['co2','temp','pressure','humidity',"iaq"]
  for(var i in measurements){
    var measure = measurements[i]
    var time_stamp = measure.timestamp
    
    if(time_stamp < until_time){
      //skip if not in time range
      break; // i think we could actually break here, this should increase performance
      //continue;
    }
    for(var n in data_points){
      var data_point = data_points[n]
      
      //das kostst am meisten Zeit, müssen wir ändern.
      var recorded_at = time_stamp
      data[data_point].data.push([measure[data_point],recorded_at]) 
      if(((typeof data[data_point].stats["mean"]) == 'undefined')){
        data[data_point].stats["mean"] = 0
      }else{
        data[data_point].stats["mean"] += measure[data_point]
      }
    }
  }


  
  console.log("here1")

  //post process
  for(var n in data_points){
    var data_point = data_points[n]
    data[data_point].stats["mean"] = data[data_point].stats["mean"]/data[data_point].data.length
  }

  console.log("here")


  res.send(data)

})


router.post('/get_devices', async function(req, res, next) {
  var session_id = req.body.session_id

  var valid = await helper.login(session_id)
  if(!valid[0]){
    res.send({msg: "no auth",error:true});
    return
  }
  var authed = valid[1]


  var ownership = await conn.query("SELECT * FROM ownership WHERE user = ?;",[authed[0]['user']])
  var devices = []
  for(var i in ownership){
    var device = await conn.query("SELECT * FROM device WHERE id = ?;",[ownership[i]['device']])
    devices.push({id:ownership[i]['device'],device_hash:device[0]['placeholder'],device_name:device[0]['name']})
  }

  res.send(devices)
})



router.post('/update_device_name', async function(req, res, next) {
  var session_id = req.body.session_id
  var device_hash = req.body.device_hash
  var device_name = req.body.device_name

  var valid = await helper.login(session_id)
  if(!valid[0]){
    res.send({msg: "no auth",error:true});
    return
  }
 
  var device = await conn.query("SELECT * FROM device WHERE placeholder = ?;",[device_hash])
  if(device.length == 0){
    res.send({msg: "device not found",error:true});
    return
  }

  await conn.query("UPDATE device SET name = ? WHERE device_hash = ?;",[device_name,device_hash])
  res.send({msg: "name changed sucessfully"});

})




router.post('/get_ampel_values', async function(req, res, next) {
  var session_id = req.body.session_id
  var device_hash = req.body.device_hash

  //maybe put all this in function 
  var valid = await helper.login(session_id)
  if(!valid[0]){
    res.send({msg: "no auth",error:true});
    return
  }
  var authed = valid[1]

  var device = await conn.query("SELECT * FROM device WHERE placeholder = ?;",[device_hash])
  if(device.length == 0){
    res.send({msg: "device not found",error:true});
    return
  }
  var device_id = device[0]['id']

  var devices = await conn.query("SELECT * FROM ownership WHERE user = ? AND device = ?;",[authed[0]['user'],device_id])
  if(devices.length == 0){
    res.send({msg: "no auth for this device",error:true});
    return
  }
  //maybe put all this in function 

  // select last 10 measurments to average out any "ausreißer"
  var last50measurments = await conn.query("SELECT humidity FROM measurement WHERE device = ? ORDER BY timestamp DESC LIMIT 10;",[device_id])
  if(last50measurments.length == 0){
    res.send({msg: "no measurments found",error:true});
    return
  }
  var sum = 0
  for(var i in last50measurments){
    sum += parseInt(last50measurments[i]['humidity'])
  }
  var average = sum/10.0

  var score = await helper.ampelvalue(average,device_id)
  var ampel_color = 'green'
  if(score > 5){
    ampel_color = 'yellow'
  }
  if(score > 10){
    ampel_color = 'yellow-red'
  }
  if(score > 18){
    ampel_color = 'red'
  }
  res.send({score:score,ampel_color:ampel_color})

})



// I dont know if we are going to use this.
router.post('/post_ai_data', async function(req, res, next) {
  var device_hash = req.body.device_hash
  var device = await conn.query("SELECT * FROM device WHERE device_hash = ?",[device_hash])
  if(device.length <= 0){
    res.send({msg: "device not found",error:true})
    return
  }
  var classifier1 = req.body.classifier1
  var classifier2 = req.body.classifier2
  var classifier3 = req.body.classifier3
  var classifier4 = req.body.classifier4
  await conn.query("INSERT INTO ai_data(device_id,classifier_1,classifier_2,classifier_3,classifier_4) VALUES(?,?,?,?,?);",[device[0]['placeholder'],classifier1,classifier2,classifier3,classifier4])
  res.send({msg: "data added"})


})


module.exports = router;
