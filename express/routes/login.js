var express = require("express");
var router = express.Router();
var passport = require("passport");
const loginController = require("../controllers/loginController");

/* GET React home page. */
router.get("/", function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  res.send(
    `GET this dude is logged the fuck in! email:${email} pass:${password}`
  );
});

/* POST React home page. */
router.post("/", passport.authenticate("local"), async function(
  req,
  res,
  next
) {
  console.log("we got her!");
  let userInfo = {
    email: req.body.email,
    password: req.body.password
  };

  await loginController.login(userInfo);
  res.send("login");
});

module.exports = router;
