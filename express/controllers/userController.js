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
        telephoneNumber: result.dataValues.telephoneNumber
      };
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = userController;
