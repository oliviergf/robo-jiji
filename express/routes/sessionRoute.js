var express = require("express");
var router = express.Router();
const Models = require("../models");
var passport = require("passport");

/* GET React home page. */
https: router.get("/", passport.authenticate("session"), async function (
  req,
  res,
  next
) {
  if (req.isAuthenticated()) {
    let unSeenCount = await Models.UserApart.count({
      where: {
        userId: req.user._id,
        seen: false,
      },
    });

    let userSubscription = await Models.Subscription.count({
      include: [
        {
          model: Models.Users,
          where: {
            _id: req.user._id,
          },
        },
      ],
    });

    res.send({
      firstname: req.user.firstname,
      unSeenCount: unSeenCount,
      userSubscription: userSubscription,
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
