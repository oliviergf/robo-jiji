var express = require("express");
var router = express.Router();
let userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", async function(req, res, next) {
  if (req.isAuthenticated) {
    const user = await userController.fetchUserInfo(req.user._id);
    res.send(user);
  } else {
    res.send(401);
  }
});

router.put("/", async function(req, res, next) {
  if (req.isAuthenticated) {
    console.log("req body", req.body);
    console.log("req user", req.user);
    if (req.body.changePassword && req.user.password !== req.body.oldPassword) {
      console.log("it got in here");
      res.send("errorOldPassword");
    } else {
      const result = await userController.updateUserInfo(
        req.user._id,
        req.body
      );

      if (result[0] === 1) {
        res.send("successful");
      } else {
        res.send(500);
      }
    }
  } else {
    res.send(401);
  }
});

module.exports = router;
