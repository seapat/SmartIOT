var crypto = require('crypto');
const { connect } = require('http2');

var helpers = {
  log: function(message) {
    console.log(this.getTimestamp() + " - " + message)
  },
  getRandomInt: function(max) { 
    return Math.floor(Math.random() * Math.floor(max));
  },
  getTimestamp: function() {
    return parseInt(Math.floor(Date.now()) / 1000);
  },
  generateSHA256: function(s) {
    return crypto.createHash('sha256').update(s).digest('hex')
  },
  generateSeed: function() {
    return crypto.createHash('sha256').update(crypto.randomBytes(100).toString('hex')).digest('hex')
  },
  notRedundantTimestamp: async function(time){
    var row = await conn.query("SELECT * FROM timestamp WHERE timestamp = ?;",[time])
    if(row.length == 0){
      await conn.query("INSERT INTO timestamp(timestamp) VALUES(?);",[time])
    }
    row = await conn.query("SELECT * FROM timestamp WHERE timestamp = ?;",[time])
    return row[0]['id'];
  },
  login: async function(session_id){
    var authed = await conn.query("SELECT * FROM session WHERE hash = ?;",[session_id])
    if(authed.length == 0){ // maybe have an expiry date too? 
      return [false,undefined]
    }
    return [true,authed];
  },
  ampelvalue: async function(average_hum,device_id){
    var device_data = await conn.query("SELECT * FROM device WHERE id = ?;",[device_id])

    var score = device_data[0]["hum_score"];
    if(average_hum >= 60 && average_hum <= 70 && device_data[0]["hum_value"] < average_hum){
      score += 5;
    }
    if(average_hum >= 80 && device_data[0]["hum_value"] < average_hum){
      score += 8;
    }

    if(average_hum < 80 && average_hum > 70 && device_data[0]["hum_value"] >= 80){
      score -= 8;
    }
    if(average_hum < 70 && device_data[0]["hum_value"] > 70){
      score -= 5;
    }

    var current_time = this.getTimestamp()
    if(current_time-24*60*60 > device_data[0]["hum_score_last_modified"]){ //time for new update

      await conn.query("UPDATE device SET hum_score_last_modified = ? WHERE id = ?",[current_time,device_id])
      if(average_hum >= 60){
        await conn.query("UPDATE device SET hum_score_days_in_row = hum_score_days_in_row + 1 WHERE id = ?;",[device_id])
      }else{
        await conn.query("UPDATE device SET hum_score_days_in_row = 0 WHERE id = ?;",[device_id])
      }
    }

    var humstreak = await conn.query("SELECT hum_score_days_in_row FROM devices WHERE id = ?;",[device_id])
    var add_to_score = humstreak[0]['hum_score_days_in_row']*2
    score+=add_to_score
    if(score < 0){
      score = 0
    }

    await conn.query("UPDATE device SET hum_value = ? WHERE id = ?;",[average_hum,device_id])
    await conn.query("UPDATE device SET hum_score = ? WHERE id = ?;",[average_hum,score])
    console.log(score)

    return score

  }
}
global.helper = helpers;
