var express = require("express");
var router = express.Router();
let userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", function(req, res, next) {
  if (req.isAuthenticated) {
    console.log("requser", req.user);
    userController.fetchUserInfo(req.user._id);
    res.send("respond with a resource");
  } else {
    res.send(401);
  }
});

module.exports = router;
