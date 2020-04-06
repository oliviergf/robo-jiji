var express = require("express");
var router = express.Router();
var passport = require("passport");
const apartementsController = require("../controllers/apartementsController");

/* GET React home page. */
router.get("/", passport.authenticate("session"), function (req, res, next) {
  if (req.isAuthenticated()) {
    apartementsController.findUserAparts(req.user._id);
    res.send({ firstname: req.user.firstname });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
