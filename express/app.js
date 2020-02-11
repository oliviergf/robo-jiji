const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/register");
const sessionLoginRouter = require("./routes/sessionLogin");
const loginRouter = require("./routes/login");
const rss = require("./services/rss/rss");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const models = require("./models");
const RSSPoolWorkers = require("./services/rss/index");
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

//creates new models if not in there; will be deleted later
models.sequelize.sync();

/**
 * SETS UP EXPRESS
 *
 * --------------------------------------------------------------------------------
 */

//to be looked over when ready to deploy
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

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
      secure: false //to allow HTTP over HTTPS
    }
  })
);

/**
 * SETS UP PASSPORT
 *
 * --------------------------------------------------------------------------------
 */

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

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
  done(null, user.dataValues);
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
app.use("/sessionLogin", sessionLoginRouter);

/**
 * launches RSS worker
 *
 * --------------------------------------------------------------------------------
 */

// RSSPoolWorkers();

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
