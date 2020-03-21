const model = require("../models");
userController = {
  fetchUserInfo: async user_id => {
    try {
      const result = await model.Users.findOne({
        where: { _id: user_id }
      });

      const user = {
        firstname: result.dataValues.firstname,
        lastname: result.dataValues.lastname,
        email: result.dataValues.email,
        telephone: result.dataValues.telephone,
        platform: result.dataValues.platform
      };
      return user;
    } catch (error) {
      console.log(error);
    }
  },
  updateUserInfo: async (user_id, updateUser) => {
    let updatedUser = {
      firstname: updateUser.firstname,
      lastname: updateUser.lastname,
      telephone: updateUser.telephone,
      email: updateUser.email,
      platform: updateUser.platform
    };
    if (updateUser.changePassword)
      updatedUser.password = updateUser.newPassword;
    return await model.Users.update(updatedUser, {
      where: {
        _id: user_id
      }
    });
  }
};

module.exports = userController;
