let bCrypt = require("bcrypt-nodejs");
let LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport, Users) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async function(req, username, password, done) {
        if (req.user) {
          return done(null, req.user);
        }
        let user = await Users.findOne({
          where: { email: username, password: password }
        });
        if (!user) {
          return done(null, false, { message: "Incorrect credentials." });
        }
        return done(null, user.dataValues);
      }
    )
  );
};
