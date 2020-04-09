var express = require("express");
var router = express.Router();
var passport = require("passport");
const vueController = require("../controllers/apartementsController");

/* GET React home page. */
router.get("/", passport.authenticate("session"), async function (
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    res.send({
      apartInfos: await vueController.findApartInfos(req.query.id),
    });
  } else {
    res.sendStatus(401);
  }
});

/* GET React home page. */
router.post("/", passport.authenticate("session"), async function (
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    res.send({
      result: await vueController.setSeenApart(req.user._id, req.query.id),
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
