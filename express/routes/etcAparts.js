var express = require("express");
var router = express.Router();
const models = require("../models");
var passport = require("passport");

router.put("/", passport.authenticate("session"), async function (
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    await models.UserApart.update(
      { seen: true },
      {
        where: {
          userId: req.user._id,
        },
      }
    );
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
