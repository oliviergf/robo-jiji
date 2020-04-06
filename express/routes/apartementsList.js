var express = require("express");
var router = express.Router();

/* GET React home page. */
router.get("/", function (req, res, next) {
  res.send({ result: "all the shit u need" });
});

module.exports = router;
