const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoSessionStore = require('connect-mongo');
const MongoStore = mongoSessionStore(session);
const passport = require('passport');
require('./passportConfig');


// require router files
const indexRouter = require('./routes/index');
const signInRouter = require('./routes/signIn');
const signOutRouter = require('./routes/signOut');
const authRouter = require('./routes/auth');
const signUpRouter = require('./routes/signUp');
const protectedRouter = require('./routes/protected');

// create app instance
const app = express();

// establish db connection
mongoose.connect(
  'mongodb://localhost/authTest',
  {
    useNewUrlParser: true
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('superSecret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// add session middleware
app.use(session({
  secret: 'superSecret',
  resave: false,
  saveUninitialized: false,
  maxAge: new Date(Date.now() + 900000),
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// add passport middleware
app.use(passport.initialize());
app.use(passport.session());

// add route handlers
app.use('/', indexRouter);
app.use('/signin', signInRouter);
app.use('/signout', signOutRouter);
app.use('/signup', signUpRouter);
app.use('/protected', protectedRouter);
app.use('/auth', authRouter);

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
