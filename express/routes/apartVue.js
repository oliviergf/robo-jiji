var express = require("express");
var router = express.Router();
var passport = require("passport");
const vueController = require("../controllers/apartVueController");

/* GET React home page. */
router.get("/", passport.authenticate("session"), async function (
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    res.send({
      data: await vueController.findApartInfos(req.user._id),
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
