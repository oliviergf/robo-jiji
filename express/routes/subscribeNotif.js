var express = require("express");
var router = express.Router();
var subscriberController = require("../controllers/subscriberController");

/* GET subscriber notification. */
router.post("/", async function(req, res, next) {
  if (req.isAuthenticated()) {
    const subscription = JSON.parse(req.body.data);
    const userInfo = req.user;
    await subscriberController.subscribeUser(userInfo, subscription);
    res.send("register that damn user!");
  } else {
    res.send(401);
  }
});

module.exports = router;
