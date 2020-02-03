const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/register");
const dbTestRouter = require("./routes/db_test");
const loginRouter = require("./routes/login");
const rss = require("./services/rss/rss");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const models = require("./models");
const app = express();

/**   TECHSTACK CHEZ SOFDESK
 * Personnaliser et déployer des outils logiciels, des processus et des mesures TECH STACK React
 * / FluxNodejs (express) MySQL (sequelize) Redis pour caching Mocha pour tests Github
 * / TravisCI pour source management TravisCI
 * / AWS pour déploiements
 */

/**
 * SYNC DB
 *
 * --------------------------------------------------------------------------------
 */

models.sequelize
  .sync()
  .then(function() {
    console.log("Nice! Database looks fine");
  })
  .catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
  });

// sequelize
//   .authenticate()
//   .then(() => console.log("Connection has been established successfully."))
//   .catch(err => console.error("Unable to connect to the database:", err));

/**
 * SETS UP EXPRESS
 *
 * --------------------------------------------------------------------------------
 */

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use((req, res, next) => {
  console.log("req.headers", req.headers);
  return next();
});

app.use(express.static(`${__dirname}/build`));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboard cat",
    cookie: {
      secure: false
    }
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// VISIT THIS LINK: https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195

//load passport strategies
require("./services/passport/passport.js")(passport, models.Users);

//serialize user into session by its _id only : might be a security issue tho.
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  let user = await models.Users.findOne({
    where: { _id: id }
  });
  console.log("deserialise user", user.dataValues);
  done(null, user.dataValues); //should error instead of null?
});

/**
 * SETS UP ROUTES
 *
 * --------------------------------------------------------------------------------
 */

app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/db", dbTestRouter);

/**
 * ERROR HANDELING
 *
 * --------------------------------------------------------------------------------
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log({
    message: err.message,
    error: err
  });

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
