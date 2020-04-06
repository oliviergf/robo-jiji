const model = require("../models");

apartementsController = {
  findUserAparts: async (userId) => {
    let results = await model.Aparts.findAll({
      attributes: ["_id", "price", "link", "createdAt"],
      include: [
        {
          model: model.Users,
          where: { _id: userId },
          as: "users",
        },
      ],
    });
    let apartsToReturn = results.map((apart) => apart.dataValues);
    apartsToReturn.map((apt) => {
      delete apt.users;
    });
    return apartsToReturn;
  },
};

module.exports = apartementsController;
