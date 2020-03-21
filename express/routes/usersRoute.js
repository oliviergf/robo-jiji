var express = require("express");
var router = express.Router();
let userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  if (req.isAuthenticated) {
    const user = await userController.fetchUserInfo(req.user._id);
    res.send(user);
  } else {
    res.send(401);
  }
});

module.exports = router;
