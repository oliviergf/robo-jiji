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

module.exports = router;
