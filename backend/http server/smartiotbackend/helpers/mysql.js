const mysql = require('mysql2/promise');

var connection;
var conn = {
  init: async function() {
    console.log("Init MySQL connection.")
    connection = await mysql.createConnection({
      host: 'x', 
      user: 'x',
      password: 'x',
      database: 'smartiot_test_db'
    });
 
  },
  query: async function(query, data) {
    if(connection == undefined){
      await this.init()
    }
    const [rows, fields] = await connection.execute(query, data);
    return rows
  }
}
global.conn = conn;
