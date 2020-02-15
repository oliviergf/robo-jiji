var express = require("express");
var router = express.Router();
var zoneController = require("../controllers/zoneController");

/* GET the users zone */
router.get("/", async function(req, res, next) {
  if (req.isAuthenticated()) {
    //todo: test with multiple zones
    const zones = await zoneController.getAllZones(req.user._id);
    res.send(zones);
  } else {
    res.send(401);
  }
});

/* POST new zone. */
router.post("/", async function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    const zoneInfo = {
      path: req.body.path,
      zoneId: req.body.zoneId,
      userId: req.user._id
    };

    //add try catch here?
    await zoneController.createZone(zoneInfo);

    res.send(200);
  } else {
    res.send(401);
  }
});
module.exports = router;
