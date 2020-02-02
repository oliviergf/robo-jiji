var express = require("express");
var router = express.Router();
const Models = require("../models");
var passport = require("passport");

/* GET React home page. */
router.get("/", async function(req, res, next) {
  console.log("HEADERS");
  console.log(req.headers);

  console.log("req user", req.user);
  console.log(req.session);

  if (req.isAuthenticated()) {
    res.send("<h1>You are authenticated</h1>");
  } else {
    res.send("<h1>You are not authenticated</h1>");
  }
  // const jane = await Models.Users.create({
  //   firstname: "Jane2",
  //   lastname: "teste2r",
  //   password: "itsnotsa2fe",
  //   email: "email@com.net"
  // });
});

module.exports = router;
