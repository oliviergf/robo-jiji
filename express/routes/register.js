var express = require("express");
var router = express.Router();

/* POST users listing. */
router.post("/", function(req, res, next) {
  console.log("heere in post request");
  res.send("register that damn user!");
});

/* GET users listing. */
router.get("/", function(req, res, next) {
  console.log("heere in get request");
  res.send("register that damn user!");
});

module.exports = router;
