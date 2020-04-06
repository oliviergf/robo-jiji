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
    const apartsToReturn = results.map((apart) => apart.dataValues);
    return apartsToReturn;
  },
};

module.exports = apartementsController;
