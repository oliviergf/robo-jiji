let bCrypt = require("bcrypt-nodejs");
let LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport, Users) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      function(username, password, done) {
        console.log("got here in passport");
        Users.findAll({ email: username, password: password }, function(
          err,
          user
        ) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }

          return done(null, user);
        });
      }
    )
  );
};
