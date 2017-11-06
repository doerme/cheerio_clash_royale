//server.js

//BASE SETUP
//====================================

//call the packages we need
var express             = require('express');
var app                 = express();
var bodyParser          = require('body-parser');
//var morgan              = require('morgan');
var fs                  = require('fs');
var path                = require('path');
var fileStreamRotator   = require('file-stream-rotator');
var cookieParser        = require('cookie-parser');

//call routers modules
var indexRouter = require('./routes/index');

//LOG
//var logDir = path.join(__dirname, 'logs');

//ensure log directory exists
//fs.existsSync(logDir) || fs.mkdirSync(logDir);
//create a rotating write stream
// var accessLogStream = fileStreamRotator.getStream({
//     date_format: 'YYYYMMDD',
//     filename: path.join(logDir, 'access-%DATE%.log'),
//     frequency: 'daily',
//     verbose: true
// });

//APP CONFIG
//====================================
//configure app to use BodyParser();
//this will let us get the data form a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
//log module
// app.use(morgan('short'));
// app.use(morgan('combined', {
//     stream: accessLogStream
// }));

var port = process.env.PORT || 8093;  //set port

//REGISTER OUR ROUTES
//===================================
app.use('/', indexRouter);

//ERROR HANDLE
app.use(function(req, res, next){
    var err = new Error('not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//START THE SERVER
//====================================
app.listen(port, function(){

    console.log('server is listening to port ' + port);
});