const model = require("../models");
subscriberController = {
  subscribeUser: async (userinfo, userToken) => {
    //check that no user has the same email provided

    //save the payload to db
    saveSubToDatabase(userinfo, userToken);
  },

  updateNotificationInfo: async (UserId, notifcationInfo) => {
    try {
      const result = await model.Subscription.findOne({
        where: { UserId: UserId },
      });
      result.checkedApplyPreferences = notifcationInfo.checkedApplyPreferences;
      result.notifyAllTheTime = notifcationInfo.checkedG;
      result.startBlockingTime = notifcationInfo.start;
      result.endBlockingTime = notifcationInfo.end;
      result.save({
        fields: [
          "notifyAllTheTime",
          "startBlockingTime",
          "endBlockingTime",
          "checkedApplyPreferences",
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};

saveSubToDatabase = async (UserId, userToken) => {
  try {
    const [sub, created] = await model.Subscription.findOrCreate({
      where: { UserId: UserId },
      defaults: {
        BrowserToken: userToken,
      },
    });

    if (!created) {
      sub.BrowserToken = userToken;
      await sub.save();
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = subscriberController;
