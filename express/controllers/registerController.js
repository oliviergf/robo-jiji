const model = require("../models");

registerController = {
  registerUser: async userinfo => {
    //check that no user has the same email provided
    let userCount = await model.Users.count({
      where: {
        email: userinfo.email
      }
    });

    if (userCount !== 0) {
      throw new Error("Email already in use");
    } else {
      //inserts new User into db
      await model.Users.create({
        firstname: userinfo.firstname,
        lastname: userinfo.lastname,
        email: userinfo.email,
        password: userinfo.password
      });
    }
  }
};

module.exports = registerController;
