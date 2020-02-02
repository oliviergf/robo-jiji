var express = require("express");
var router = express.Router();
const Models = require("../models");
var passport = require("passport");

/* GET React home page. */
router.get("/", passport.authenticate("local"), async function(req, res, next) {
  console.log(req.user);
  const jane = await Models.Users.create({
    firstname: "Jane2",
    lastname: "teste2r",
    password: "itsnotsa2fe",
    email: "email@com.net"
  });

  res.send("db tests");
});

module.exports = router;
