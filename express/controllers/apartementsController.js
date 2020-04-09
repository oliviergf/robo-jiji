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
      apt.seen = apt.users[0].dataValues.UserApart.dataValues.seen;
      delete apt.users;
    });
    return apartsToReturn;
  },
  findApartInfos: async (apartId) => {
    let result = await model.Aparts.findOne({ where: { _id: apartId } });
    return result.dataValues;
  },
  setSeenApart: async (userId, apartId) => {
    // add seen shit to datastruc.
  },
};

module.exports = apartementsController;
