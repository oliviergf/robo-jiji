const model = require("../models");

LoginController = {
  login: async (userinfo) => {
    let user = await model.Users.findAll({
      where: {
        email: userinfo.email,
        password: userinfo.password,
      },
    });

    if (user.length === 1) {
      let unSeenApartCount = await model.UserApart.count({
        where: {
          userId: user[0].dataValues._id,
          seen: false,
        },
      });
      return {
        firstname: user[0].dataValues.firstname,
        unSeenCount: unSeenApartCount,
      };
    } else {
      return null;
    }
  },
};

module.exports = LoginController;
