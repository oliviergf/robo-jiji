var express = require("express");
var router = express.Router();
const preferenceController = require("../controllers/preferenceController");
const Models = require("../models");
var passport = require("passport");

https: router.put("/", async function(req, res, next) {
  if (req.isAuthenticated()) {
    try {
      await preferenceController.savePreferences(req.user._id, req.body.data);
      res.send({ result: "success" });
    } catch (error) {}
  } else {
    res.sendStatus(401);
  }
});

https: router.get("/", async function(req, res, next) {
  if (req.isAuthenticated()) {
    try {
      const preferences = {
        dateAvailable: req.user.dateAvailable,
        priceStart: req.user.priceStart,
        priceEnd: req.user.priceEnd,
        rooms: JSON.parse(req.user.rooms),
        numberBedrooms: JSON.parse(req.user.numberBedrooms),
        furnished: req.user.furnished,
        parkingAvailable: req.user.parkingAvailable,
        wheelchairAccessible: req.user.wheelchairAccessible,
        petsAllowed: req.user.petsAllowed
      };
      res.send(preferences);
    } catch (error) {}
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
