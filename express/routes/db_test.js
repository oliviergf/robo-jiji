var express = require("express");
var router = express.Router();
const Models = require("../models");

/* GET React home page. */
router.get("/", async function(req, res, next) {
  const jane = await Models.Users.create({
    firstname: "Jane2",
    lastname: "teste2r",
    password: "itsnotsa2fe",
    email: "email@com.net"
  });

  res.send("db tests");
});

module.exports = router;
