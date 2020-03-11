const model = require("../models");
subscriberController = {
  subscribeUser: async (userinfo, userToken) => {
    //check that no user has the same email provided

    //save the payload to db
    saveSubToDatabase(userinfo, userToken);
  }
};

//developers.google.com/web/fundamentals/push-notifications/sending-messages-with-web-push-libraries
saveSubToDatabase = async (UserId, userToken) => {
  try {
    await model.Subscription.create({
      BrowserToken: userToken,
      UserId: UserId
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = subscriberController;
