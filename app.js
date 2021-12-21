var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport=require("passport")
const cors=require("cors")
var authRouter = require('./routes/auth');
var taskRouter = require('./routes/task');
const swaggerUI=require("swagger-ui-express")
const connectDb=require("./models/connection")
var app = express();

// create connection with database(mongodb)

connectDb()


// initilize cors
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// initilize passport
app.use(passport.initialize())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api-doc",swaggerUI.serve,swaggerUI.setup(require("./swagger-doc.json")))

app.use('/auth', authRouter);
app.use('/', taskRouter);

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
