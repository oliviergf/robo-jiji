var express = require("express");
var router = express.Router();
var subscriberController = require("../controllers/subscriberController");

/* GET subscriber notification. */
router.get("/", async function(req, res, next) {
  //   if (req.isAuthenticated()) {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: "test" });
  const userInfo = { username: "olivier" };
  console.log(subscription);
  await subscriberController.subscribeUser(userInfo, payload);
  res.send("register that damn user!");
  //   } else {
  //     res.send(401);
  //   }
});

module.exports = router;
