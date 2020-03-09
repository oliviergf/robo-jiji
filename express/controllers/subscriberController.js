const model = require("../models");
subscriberController = {
  subscribeUser: async (userinfo, payload) => {
    //check that no user has the same email provided
    console.log("in sub controller payload", payload);

    //save the payload to db
    saveSubToDatabase(payload);

    console.log("in sub controller userinfo", userinfo);
    // webpush.sendNotification(subscription, payload).catch(error => {
    //   console.error(error.stack);
    // });
  }
};

//developers.google.com/web/fundamentals/push-notifications/sending-messages-with-web-push-libraries
saveSubToDatabase = async payload => {
  //todo: implement this shit
};
module.exports = subscriberController;
