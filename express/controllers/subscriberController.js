const model = require("../models");
subscriberController = {
  subscribeUser: async (userinfo, userToken) => {
    //check that no user has the same email provided

    //save the payload to db
    saveSubToDatabase(userinfo, userToken);
  },

  updateNotificationInfo: async (userinfo, notifcationInfo) => {
    console.log(userinfo);
    console.log(notifcationInfo);
    //save the payload to db
    // saveSubToDatabase(userinfo, userToken);
  }
};

saveSubToDatabase = async (UserId, userToken) => {
  try {
    const [sub, created] = await model.Subscription.findOrCreate({
      where: { UserId: UserId },
      defaults: {
        BrowserToken: userToken
      }
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
