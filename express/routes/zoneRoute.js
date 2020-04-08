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
    const zoneInfo = {
      path: req.body.path,
      zoneId: req.body.zoneId,
      userId: req.user._id,
      name: req.body.name
    };

    try {
      await zoneController.createZone(zoneInfo);
    } catch (error) {
      res.send(500);
    }

    res.send(200);
  } else {
    res.send(401);
  }
});

router.delete("/", async function(req, res, next) {
  if (req.isAuthenticated()) {
    const zoneInfo = {
      zoneId: req.body.zoneId
    };

    try {
      await zoneController.deleteZone(zoneInfo);
    } catch (error) {
      res.send(500);
    }
    res.send(200);
  } else {
    res.send(401);
  }
});
module.exports = router;
