var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var logger = require("morgan");
const request = require("request");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testDBRouter = require("./routes/testdb");
var app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.static(`${__dirname}/build`));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/testdb", testDBRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let count = 0;

let call = () => {
  request(
    "https://www.kijiji.ca/rss-srp-for-rent/quebec/c30349001l9001",
    { json: true },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body);
      console.log(`call: ${count}`);
      count++;
    }
  );
};

setInterval(function() {
  call();
}, 3000);

module.exports = app;