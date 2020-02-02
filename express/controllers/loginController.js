const model = require("../models");

LoginController = {
  login: async userinfo => {
    //check that no user has the same email provided
    let userCount = await model.Users.count({
      where: {
        email: userinfo.email,
        password: userinfo.password
      }
    });

    console.log("login controler here");

    if (userCount === 1) {
      console.log("user exist create session and send back JWT?");
    } else {
      console.log("user doesnt exist");
    }
  }
};

module.exports = LoginController;
