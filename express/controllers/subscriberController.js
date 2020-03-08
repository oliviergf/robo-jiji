const model = require("../models");

subscriberController = {
  subscribeUser: async (userinfo, payload) => {
    //check that no user has the same email provided

    webpush.sendNotification(subscription, payload).catch(error => {
      console.error(error.stack);
    });
  }
};

module.exports = registerController;
