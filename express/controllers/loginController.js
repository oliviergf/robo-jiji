const model = require("../models");
const hasher = require("../utils/hasher");
LoginController = {
  login: async (userinfo) => {
    let hashPassword = hasher.getHash(userinfo.password);
    let user = await model.Users.findAll({
      where: {
        email: userinfo.email,
        password: hashPassword,
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
        _id: user[0].dataValues._id,
        unSeenCount: unSeenApartCount,
      };
    } else {
      return null;
    }
  },
};

module.exports = LoginController;
