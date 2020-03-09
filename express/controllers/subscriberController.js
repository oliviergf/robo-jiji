const model = require("../models");
subscriberController = {
  subscribeUser: async (userinfo, payload) => {
    //check that no user has the same email provided
    console.log("in sub controller payload", payload);
    console.log("in sub controller userinfo", userinfo);
    // webpush.sendNotification(subscription, payload).catch(error => {
    //   console.error(error.stack);
    // });
  }
};

module.exports = subscriberController;
