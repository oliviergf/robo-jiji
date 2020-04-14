const model = require("../models");

apartementsController = {
  findUserAparts: async (user, seeAllUserAparts) => {
    let userPreferences = {};
    let results;

    //user wants to see aparts with preferences
    if (!seeAllUserAparts) {
      //default preferences, always on
      let userPreferences = {
        dateAvailable: { [model.Sequelize.Op.gte]: user.dateAvailable },
        price: {
          [model.Sequelize.Op.between]: [user.priceStart, user.priceEnd],
        },
      };

      if (user.furnished) userPreferences.furnished = true;
      if (user.parkingAvailable) userPreferences.parkingAvailable = true;
      if (user.petsAllowed) userPreferences.petsAllowed = true;
      if (user.wheelchairAccessible)
        userPreferences.wheelchairAccessible = true;
      userPreferences.price = {
        [model.Sequelize.Op.between]: [user.priceStart, user.priceEnd],
      };
    }

    results = await model.Aparts.findAll({
      // attributes: ["_id", "price", "link", "createdAt"],
      where: userPreferences,
      include: [
        {
          model: model.Users,
          where: { _id: user._id },
          as: "users",
        },
      ],
    });

    let apartsToReturn = results.map((apart) => apart.dataValues);

    //filters aparts according to room preference. should be in db query but too lazy
    if (!seeAllUserAparts) {
      apartsToReturn = apartsToReturn.filter((apart) =>
        filterApartByRoomSize(apart.rooms, JSON.parse(user.rooms))
      );
    }

    console.log("user roms", JSON.parse(user.rooms));
    console.log("seeAllUserAparts", seeAllUserAparts);
    //trims off info we dont want to send to client
    apartsToReturn.map((apt) => {
      console.log("returned room", apt.rooms);
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

const filterApartByRoomSize = (apartRooms, userRooms) => {
  if (apartRooms === null) return false;
  let filterApart = false;
  userRooms.map((userRoom) => {
    //to be figured out but assuming apartRooms is always 1 ½ ou 2 ½ or simply 1
    console.log(apartRooms);
    if (
      (userRoom === "1 1/2" || userRoom === "2 2/2") &&
      (apartRooms.includes("1 ½ ou 2 ½") || apartRooms === "1")
    )
      filterApart = true;
    else if (apartRooms.includes(userRoom)) filterApart = true;
  });
  return filterApart;
};

module.exports = apartementsController;
