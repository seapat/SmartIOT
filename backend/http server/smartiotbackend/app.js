var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var sensorApiRouter = require('./routes/sensor');
var sensorApiRouterWithUser = require('./routes/user');

const { connect } = require('./routes/index');
var bodyParser = require('body-parser')

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use( bodyParser.json() );  

//mysql connection 
require("./helpers/mysql")

setInterval(function(){
    conn.query("SELECT 1;")
},5000)

require("./helpers/misc")


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sensor_api', sensorApiRouter);
app.use('/sensor_api_user', sensorApiRouterWithUser);


process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated')
    })
})

exports.app = app;
exports.conn = conn;
