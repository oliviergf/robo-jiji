var express = require("express");
var router = express.Router();
var passport = require("passport");
const vueController = require("../controllers/apartementsController");

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

router.post("/", passport.authenticate("session"), async function (
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    res.send({
      result: await vueController.setSeenApart(req.user._id, req.body.apartId),
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
