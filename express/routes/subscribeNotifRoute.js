var express = require("express");
var router = express.Router();
var subscriberController = require("../controllers/subscriberController");
const pushNotification = require("../services/notification/pushNotification");

/* GET subscriber notification. */
router.post("/", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const userToken = req.body.data;
    const userInfo = req.user;
    await subscriberController.subscribeUser(userInfo._id, userToken);
    res.send("register that damn user!");
  } else {
    res.sendStatus(401);
  }
});

/**
 * triggers notification testing purposes
 */
router.get("/", async function (req, res, next) {
  if (req.isAuthenticated()) {
    pushNotification(req.user._id, "ok that a notification!");
    res.send("register that damn user!");
  } else {
    res.sendStatus(401);
  }
});

router.put("/", async function (req, res, next) {
  if (req.isAuthenticated()) {
    await subscriberController.updateNotificationInfo(req.user._id, req.body);
    res.send("register that damn user!");
  } else {
    res.sendStatus(401);
  }
});
module.exports = router;
