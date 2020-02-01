var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  console.log("heere in register get request");
  res.send("register that damn user!");
});

/* POST users listing.
 */
router.post("/", function(req, res, next) {
  console.log("heere in register post request");
  res.send("register that damn user!");
});

module.exports = router;
