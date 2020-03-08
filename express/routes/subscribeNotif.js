var express = require("express");
var router = express.Router();
var subscriberController = require("../controllers/subscriberController");

/* GET subscriber notification. */
router.get("/", async function(req, res, next) {
  if (req.isAuthenticated()) {
    const userInfo = { bruh: "brah" };
    await subscriberController.subscribeUser(userInfo);
    res.send("register that damn user!");
    res.send(zones);
  } else {
    res.send(401);
  }
});

module.exports = router;
