var express = require("express");
var router = express.Router();

/* GET React home page. */
router.get("/", function(req, res, next) {
  res.send("db tests");
});

module.exports = router;
