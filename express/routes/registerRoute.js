var express = require("express");
var router = express.Router();
var registerController = require("../controllers/registerController");

/* GET users listing. */
router.get("/", function(req, res, next) {
  console.log("heere in register get request");
  res.send("register that damn user!");
});

/* 
  POST users listing.
 */
router.post("/", async function(req, res, next) {
  //TODO: add event validation to protect from creating a shitton of Users
  //TODO: CATCH ERROR THAT VALIDATION IS ALREADY USED

  const userInfo = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  };

  console.log(userInfo);

  let result = await registerController.registerUser(userInfo);
  if (result === "emailUsed") {
    res.send("emailUsed");
  } else {
    res.send("success");
  }
});

module.exports = router;
