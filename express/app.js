const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/register");
const zoneRouter = require("./routes/zone");
const sessionLoginRouter = require("./routes/sessionLogin");
const loginRouter = require("./routes/login");
const subscribeNotifRouter = require("./routes/subscribeNotif");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const models = require("./models");
const app = express();

const sessionTimeOutMinutes = 60 * 3; //3 hours

/**   TECHSTACK CHEZ SOFDESK
 * Personnaliser et déployer des outils logiciels, des processus et des mesures TECH STACK React
 * / FluxNodejs (express) MySQL (sequelize) Redis pour caching Mocha pour tests Github
 * / TravisCI pour source management TravisCI
 * / AWS pour déploiements
 */

// http://legisquebec.gouv.qc.ca/fr/ShowDoc/cs/C-1.1
// http://www.blogueducrl.com/2019/11/chronique-du-cti-banques-de-donnees.html
// use this for drawing logos! https://excalidraw.com/

// forks n shit https://medium.com/the-andela-way/scaling-out-with-node-clusters-1dca4a39a2a

//  metttre un temps prefere pour shut down les notificatiosn?

/**
 * SYNC DB
 * todo: check pour timezone. doesnt seem right
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
      secure: false, //to allow HTTP over HTTPS
      maxAge: 1000 * 60 * sessionTimeOutMinutes //in millisec
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
// terminates user session and delete req.user
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
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
app.use("/zone", zoneRouter);
app.use("/subscribeNotif", subscribeNotifRouter);

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
//todo: remove --inspect in start for prod
