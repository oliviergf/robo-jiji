const model = require("../models");
subscriberController = {
  subscribeUser: async (userinfo, payload) => {
    //check that no user has the same email provided
    console.log("in sub controller payload", payload);

    //save the payload to db
    saveSubToDatabase(payload, userinfo._id);

    console.log("in sub controller userinfo", userinfo);
    // webpush.sendNotification(subscription, payload).catch(error => {
    //   console.error(error.stack);
    // });
  }
};

//developers.google.com/web/fundamentals/push-notifications/sending-messages-with-web-push-libraries
saveSubToDatabase = async (payload, UserId) => {
  try {
    model.Subscribtion.create({
      endPoint: payload.endPoint,
      p256dh: payload.keys.p256dh,
      auth: payload.keys.auth,
      expirationTime: payload.expirationTime,
      UserId: UserId
    });
  } catch (error) {
    console.log("crap");
  }
};
module.exports = subscriberController;
