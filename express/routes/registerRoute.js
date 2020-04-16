var express = require("express");
var router = express.Router();
var registerController = require("../controllers/registerController");

/* 
  POST users listing.
 */
router.post("/", async function (req, res, next) {
  const userInfo = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    telephone: req.body.telephone,
    platform: req.body.platform,
  };

  let result = await registerController.registerUser(userInfo);
  if (result === "emailUsed") {
    res.send("emailUsed");
  } else {
    res.send("success");
  }
});

module.exports = router;
