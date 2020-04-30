const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/usersRoute");
const registerRouter = require("./routes/registerRoute");
const zoneRouter = require("./routes/zoneRoute");
const etcApartsRouter = require("./routes/etcAparts");
const sessionLoginRouter = require("./routes/sessionRoute");
const loginRouter = require("./routes/loginRoute");
const subscribeNotifRouter = require("./routes/subscribeNotifRoute");
const vueRouter = require("./routes/apartVue");
const preferencesRouter = require("./routes/preferencesRoute");
const apartementsRouter = require("./routes/apartementsList");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./models");
const app = express();
var SequelizeStore = require("connect-session-sequelize")(session.Store);

/**
 * SYNC DB
 * todo: check pour timezone. doesnt seem right
 * --------------------------------------------------------------------------------
 */

//creates new models if not in there; will be deleted later
db.sequelize.sync();

// initalize sequelize with session store
var myStore = new SequelizeStore({
  db: db.sequelize,
});

/**
 * SETS UP EXPRESS
 *
 * --------------------------------------------------------------------------------
 */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.static(`${__dirname}/build`));
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "pictures")));

const expiryDate = new Date(Date.now() + 60 * 60 * 10000); //10 hours
const sessionTimeOutMinutes = 60 * 3; //3 hours

app.use(
  session({
    secret: "keyboardmousecatsniff",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, //to allow HTTP over HTTPS
      maxAge: 1000 * 1000 * 60 * sessionTimeOutMinutes, //in millisec
      expires: expiryDate,
    },
    store: myStore,
  })
);

//sync session store db stuff
myStore.sync();

/**
 * SETS UP PASSPORT
 *
 * --------------------------------------------------------------------------------
 */

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//load passport strategies
require("./services/passport/passport.js")(passport, db.Users);

//serialize user into session by its _id only : might be a security issue tho.
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  let user = await db.Users.findOne({
    where: { _id: id },
  });
  done(null, user.dataValues);
});

// terminates user session and delete req.user
app.get("/logout", function (req, res) {
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
app.use("/preferences", preferencesRouter);
app.use("/apartements", apartementsRouter);
app.use("/etcAparts", etcApartsRouter);
app.use("/apartVue", vueRouter);

/**
 * ERROR HANDELING
 *
 * --------------------------------------------------------------------------------
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log({
    message: err.message,
    error: err,
  });

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

module.exports = app;
