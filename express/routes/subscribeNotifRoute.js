var express = require("express");
var router = express.Router();
var subscriberController = require("../controllers/subscriberController");
const pushNotification = require("../services/notification/pushNotification");

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

/**
 * triggers notification testing purposes
 */
router.get("/", async function(req, res, next) {
  console.log("IT GO IN HERE");
  console.log("req body", req.body);
  pushNotification("hello", "ok");
  res.send("register that damn user!");
});

module.exports = router;
