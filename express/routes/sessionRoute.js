var express = require("express");
var router = express.Router();
const Models = require("../models");
var passport = require("passport");

/* GET React home page. */
// check this shit out for sessions : medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d
https: router.get("/", passport.authenticate("session"), async function (
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    let unSeenApartCount = await Models.UserApart.count({
      where: {
        userId: req.user._id,
        seen: false,
      },
    });
    console.log("unSeenCount", unSeenApartCount);

    res.send({ firstname: req.user.firstname, unSeenCount: unSeenApartCount });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
