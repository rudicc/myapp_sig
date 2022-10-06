var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
const hbs = require('hbs');

const { createStrame } = require('fs');
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
 
//const fileUpload = require('express-fileupload');
//const fileUpload = require('./utility/properties');




 
//const dotenv = require('dotenv');
//const mysql = require("mysql");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
 
var authRouter = require('./routes/auth');
var apiRouter = require('./routes/api');


 
 
 
var app = express();

 

//session
app.use(session({
    secret: 'sigsecret',
    resave: false,
    saveUninitialized: true,    
    cookie: { MaxAge: 24 * 60 * 60 * 1000 }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const partialsPath = path.join(__dirname,"./views/partials");
hbs.registerPartials(partialsPath);

const viewsPath = path.join(__dirname,"./views");
hbs.registerPartials(viewsPath);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//stylesheets
app.use('/stylesheets/', express.static(path.join(__dirname, './public/stylesheets')));
 
//javascripts
app.use('/javascripts/', express.static(path.join(__dirname, './public/javascripts')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/auth', authRouter);
app.use('/api', apiRouter);


//paypal 
app.use('/payment.routes/', require('./routes/payment.routes'));

//app.use('/chatmessager_web/' , require('./routes/chatmessager_web'));
//three.js 
app.use('/build/', express.static(path.join(__dirname, './node_modules/three/build')));
// app.use('/jsm/', express.static(path.join(__dirname, './node_modules/three/examples/jsm')));
app.use('/examples/', express.static(path.join(__dirname, './node_modules/three/examples')));


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
  res.render('error');
});







module.exports = app;
