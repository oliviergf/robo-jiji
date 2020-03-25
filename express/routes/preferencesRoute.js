var express = require("express");
var router = express.Router();
const Models = require("../models");
var passport = require("passport");

/* GET React home page. */
https: router.put("/", async function(req, res, next) {
  console.log("in that preferences controller");
  if (req.isAuthenticated()) {
    res.send({ firstname: req.user.firstname });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
