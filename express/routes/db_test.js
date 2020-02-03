var express = require("express");
var router = express.Router();
const Models = require("../models");
var passport = require("passport");

/* GET React home page. */
router.get("/", async function(req, res, next) {
  console.log("req user", req.user);
  console.log("req session", req.session);

  if (req.isAuthenticated()) {
    res.send("<h1>You are authenticated</h1>");
  } else {
    res.send("<h1>You are not authenticated</h1>");
  }
});

module.exports = router;
