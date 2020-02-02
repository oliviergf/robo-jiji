var express = require("express");
var router = express.Router();
var passport = require("passport");
const loginController = require("../controllers/loginController");

/* GET React home page. */
router.get("/", function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  res.send(
    `GET this dude is logged the fuck in! email:${email} pass:${password}`
  );
});

/* POST React home page. */
router.post("/", passport.authenticate("local"), async function(
  req,
  res,
  next
) {
  console.log("we got her!");
  let userInfo = {
    email: req.body.email,
    password: req.body.password
  };

  await loginController.login(userInfo);
  res.send("login");
});

// router.post(
//   "/",
//   // wrap passport.authenticate call in a middleware function
//   function(req, res, next) {
//     // call passport authentication passing the "local" strategy name and a callback function
//     passport.authenticate("local", function(error, user, info) {
//       // this will execute in any case, even if a passport strategy will find an error
//       // log everything to console
//       console.log(error);
//       console.log(user);
//       console.log(info);

//       if (error) {
//         res.status(401).send(error);
//       } else if (!user) {
//         res.status(401).send(info);
//       } else {
//         next();
//       }

//       res.status(401).send(info);
//     })(req, res);
//   },

//   // function to call once successfully authenticated
//   function(req, res) {
//     res.status(200).send("logged in!");
//   }
// );
module.exports = router;
