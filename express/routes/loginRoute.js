var express = require("express");
var router = express.Router();
var passport = require("passport");
const loginController = require("../controllers/loginController");

/* GET   */
router.get("/", function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  res.send(
    `GET this dude is logged the fuck in! email:${email} pass:${password}`
  );
});

/* POST  */
router.post("/", passport.authenticate("local"), async function(
  req,
  res,
  next
) {
  let userInfo = {
    email: req.body.email,
    password: req.body.password
  };

  //todo: here we only send back userfirstname
  // we may want to send more info than that, to let the user changes his account settings and stuff.
  const user = await loginController.login(userInfo);
  if (user) {
    // req.login(user, function(err) {
    //   if (err) {
    //     return next(err);
    //   }
    // });
    res.send({ firstname: user.firstname });
  } else {
    res.send(401);
  }
});

module.exports = router;
