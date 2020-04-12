const model = require("../models");

apartementsController = {
  findUserAparts: async (user, seeAllUserAparts) => {
    let userPreferences = {};

    console.log(seeAllUserAparts);
    let results;

    if (!seeAllUserAparts) {
      console.log("sup");

      // userPreferences.dateAvailable = ;
      // userPreferences.price = {
      //   [Op.between]: [user.priceStart, user.priceEnd],
      // };
      // // if (user.petsAllowed) userPreferences.petsAllowed = true;

      results = await model.Aparts.findAll({
        attributes: ["_id", "price", "link", "createdAt"],
        where: {
          dateAvailable: { [model.Sequelize.Op.gte]: user.dateAvailable },
          price: {
            [model.Sequelize.Op.between]: [user.priceStart, user.priceEnd],
          },
        },
        include: [
          {
            model: model.Users,
            where: { _id: user._id },
            as: "users",
          },
        ],
      });
    } else {
      results = await model.Aparts.findAll({
        attributes: ["_id", "price", "link", "createdAt"],
        where: userPreferences,
        include: [
          {
            model: model.Users,
            where: { _id: user._id },
            as: "users",
          },
        ],
      });
    }

    // console.log(userPreferences);

    let apartsToReturn = results.map((apart) => apart.dataValues);

    // console.log("\n\n\n\nstuff we can see in aparts", apartsToReturn.length);

    apartsToReturn.map((apt) => {
      apt.seen = apt.users[0].dataValues.UserApart.dataValues.seen;
      apt.zoneName = apt.users[0].dataValues.UserApart.dataValues.zoneName;
      delete apt.users;
    });
    return apartsToReturn;
  },
  findApartInfos: async (apartId) => {
    let result = await model.Aparts.findOne({ where: { _id: apartId } });
    return result.dataValues;
  },
  setSeenApart: async (userId, apartId) => {
    let userApart = await model.UserApart.findOne({
      where: {
        userId: userId,
        apartId: apartId,
      },
    });

    userApart.seen = true;
    userApart.save();
  },
};

module.exports = apartementsController;
