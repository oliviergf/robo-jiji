var express = require("express");
var router = express.Router();
const Models = require("../models");
var passport = require("passport");

/* GET React home page. */
router.get("/", passport.authenticate("session"), async function(
  req,
  res,
  next
) {
  console.log("req user", req.user);
  console.log("req session", req.session);

  //TODO: might want to send more info here
  //todo: update user last loggedin
  if (req.isAuthenticated()) {
    res.send({ firstname: req.user.firstname });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
