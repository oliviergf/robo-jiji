const model = require("../models");

preferenceController = {
  savePreferences: async (userId, prefs) => {
    let user = await model.Users.findOne({
      where: {
        _id: userId,
      },
    });

    if (user) {
      user.dateAvailable = prefs.dateAvailable;
      user.priceStart = prefs.priceStart;
      user.priceEnd = prefs.priceEnd;
      user.rooms = JSON.stringify(prefs.rooms);
      user.numberBedrooms = JSON.stringify(prefs.numberBedrooms);
      user.parkingAvailable = prefs.parkingAvailable;
      user.wheelchairAccessible = prefs.wheelchairAccessible;
      user.petsAllowed = prefs.petsAllowed;
      user.furnished = prefs.furnished;
    }

    user.save().catch((error) => {
      console.log(error);
      //todo handle error
    });
  },
};

module.exports = preferenceController;
