var express = require("express");
var router = express.Router();
var mysql = require("mysql");

//inserting into db
var con = mysql.createConnection({
  host: "localhost",
  user: "debian-sys-maint",
  password: "4wHl2v2nDDmWcS8b",
  database: "devbot"
});

/**
 * Example of an SQL query
 */

/* GET users listing. */
router.get("/", function(req, res, next) {
  console.log("heere in get request");
  res.send("register that damn user!");
});

/* POST users listing. 
todo: handle que le user peut pas etre deja la
*/
router.post("/", function(req, res, next) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;

  const sql = `INSERT INTO Users (firstname, lastname, email, password, coins) VALUES ('${firstname}','${lastname}','${email}',MD5('${password}'),0)`;
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("1 record inserted, ID: " + result.insertId);
  });

  res.send("register that damn user!");
});

module.exports = router;
