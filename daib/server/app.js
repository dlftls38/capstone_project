var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var app = express();
var api = require('./routes');
var bodyParser  = require('body-parser');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connect = require('./schemas');
connect();

/* use session */
app.use(session({
  secret: 'Capstone$Daib',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
// app.set('views', path.join(__dirname, './view'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '../client/public/index.html')));
app.use('/api', api);
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public/index.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

//json 통신 test
app.post("/",function(req,rest,next){
	return res.json({success:true, msg:"good"});
})


module.exports = app;
