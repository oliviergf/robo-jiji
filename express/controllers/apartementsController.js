const model = require("../models");

apartementsController = {
  findUserAparts: async (userId) => {
    let result = await model.Aparts.findAll({
      include: [
        {
          model: model.Users,
          where: { _id: userId },
          as: "users",
        },
      ],
    });

    console.log(result);
  },
};

module.exports = apartementsController;
