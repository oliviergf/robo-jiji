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

saveSubToDatabase = async () => {
  //todo: implement this shit
};
module.exports = subscriberController;
