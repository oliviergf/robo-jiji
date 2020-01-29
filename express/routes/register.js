var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  console.log("heere in get request");
  res.send("register that damn user!");
});

/* POST users listing. */
router.post("/", function(req, res, next) {
  console.log("heere post request in post request");
  console.log(req.body);
  console.log(req.params);
  res.send("register that damn user!");
});

module.exports = router;
