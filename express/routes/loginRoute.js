var express = require("express");
var router = express.Router();
var passport = require("passport");
const loginController = require("../controllers/loginController");
var Models = require("../models");

/* POST  */
router.post("/", passport.authenticate("local"), async function (
  req,
  res,
  next
) {
  let userInfo = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await loginController.login(userInfo);
  if (user) {
    let userSubscription = await Models.Subscription.count({
      include: [
        {
          model: Models.Users,
          where: {
            _id: user._id,
          },
        },
      ],
    });
    res.send({
      firstname: user.firstname,
      unSeenCount: user.unSeenCount,
      userSubscription: userSubscription,
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
