const model = require("../models");
userController = {
  fetchUserInfo: async user_id => {
    try {
      const result = await model.Users.findOne({
        where: { _id: user_id }
      });

      const user = {
        firstname: result.dataValues.firstname,
        lastName: result.dataValues.lastName,
        email: result.dataValues.email,
        telephone: result.dataValues.telephone,
        platform: result.dataValues.platform
      };
      return user;
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = userController;
