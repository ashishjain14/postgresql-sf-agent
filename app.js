'use strict'

const express = require('express');
const path = require('path');
const logger = require('./lib/logger');
const bodyParser = require('body-parser');
const users = require('./routes/users')
const index = require('./routes/index')
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');


const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger);
app.use(bodyParser.json());
//app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', index);
app.use('/users', users);
app.use('/v1', require('./routes/api_router'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
