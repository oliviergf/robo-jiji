var express = require("express");
var router = express.Router();

/* GET React home page. */
router.get("/", function (req, res, next) {
  console.log("it got in here /index");
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = router;
