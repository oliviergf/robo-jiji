var express = require("express");
var router = express.Router();
var passport = require("passport");

/* GET React home page. */
router.get("/", passport.authenticate("local-signup"), function(
  req,
  res,
  next
) {
  const email = req.body.email;
  const password = req.body.password;
  res.send(
    `GET this dude is logged the fuck in! email:${email} pass:${password}`
  );
});

/* POST React home page. */
router.post("/", function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  res.send(
    `POST this dude is logged the fuck in! email:${email} pass:${password}`
  );
});

module.exports = router;
