var express = require("express");
var router = express.Router();
var mysql = require("mysql");

/**
 * Example of an SQL query
 */

var connection = mysql.createConnection({
  host: "localhost",
  user: "debian-sys-maint",
  password: "4wHl2v2nDDmWcS8b",
  database: "devbot"
});

/* GET React home page. */
router.get("/", function(req, res, next) {
  connection.connect();

  connection.query("SELECT 1 + 1 AS solution", function(err, rows, fields) {
    if (err) throw err;

    console.log("The solution is: ", rows[0].solution);
  });

  connection.end();

  res.send("testing mySQL");
});

module.exports = router;
