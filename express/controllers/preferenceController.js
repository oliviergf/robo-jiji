const model = require("../models");

preferenceController = {
  savePreferences: async (userId, prefs) => {
    console.log(prefs);
    console.log(userId);
    //todo: check that no user has the same email provided
    //todo: handle all exceptions
    // let user = await model.Users.findAll({
    //   where: {
    //     email: userinfo.email,
    //     password: userinfo.password
    //   }
    // });

    // //todo: implements last_login update :)
    // //todo: we may want to send more info than that.
    // if (user.length === 1) {
    //   return user[0].dataValues;
    // } else {
    //   return null;
    // }
  }
};

module.exports = preferenceController;
