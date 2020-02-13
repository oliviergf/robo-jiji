var express = require("express");
var router = express.Router();
const Models = require("../models");
var passport = require("passport");

/* GET React home page. */
router.get("/", async function(req, res, next) {
  console.log("req user", req.user);
  if (req.isAuthenticated()) {
    console.log(req.body);
    res.send({ firstname: req.user.firstname });
  } else {
    res.send(401);
  }
});

/* GET React home page. */
router.post("/", async function(req, res, next) {
  console.log("req user", req.user);
  if (req.isAuthenticated()) {
    req.body.path.map(object => console.log(object));
    console.log(req.body);
    res.send({ firstname: req.user.firstname });
  } else {
    res.send(401);
  }
});
module.exports = router;
