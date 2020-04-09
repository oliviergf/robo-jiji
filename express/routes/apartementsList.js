var express = require("express");
var router = express.Router();
var passport = require("passport");
const apartementsController = require("../controllers/apartementsController");

/* GET React home page. */
router.get("/", passport.authenticate("session"), async function (
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    const dashboardInfo = {
      data: await apartementsController.findUserAparts(req.user._id),
      checkedList: await apartementsController.getSeenAparts(req.user._id),
    };

    res.send(dashboardInfo);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
