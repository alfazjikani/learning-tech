var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var compression = require('compression');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var studentRouter = require('./routes/student');

var app = express();

// compress all routes
app.use(compression());

// protect from vulnerable attacks
app.use(helmet());

// initializing database connection
var mongoose = require('mongoose');

var mongoDBCloudUrl = 'mongodb+srv://root:root@cluster0-fcizl.mongodb.net/student_management?retryWrites=true&w=majority';
var mongoDBOnpremiseUrl = 'mongodb://localhost:27017/student_management';
var mongoDBUrl = process.env.MONGODB_URI || mongoDBCloudUrl || mongoDBOnpremiseUrl;

mongoose.connect(mongoDBUrl, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection failed!!'));

// use session for login
const SESSION_TIMEOUT_MINUTES = 5;
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  cookie: {
    maxAge: SESSION_TIMEOUT_MINUTES * 60 * 1000
  },
  rolling: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/student', studentRouter);

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

app.locals.moment = require('moment');

module.exports = app;
