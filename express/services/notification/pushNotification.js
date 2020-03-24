const axios = require("axios");
const models = require("../../models");
const logger = require("../../utils/logger");
const moment = require("moment");
const webpush = require("web-push");
const log = new logger();

let admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://super-awesome-party.firebaseio.com"
});

// sleep 3 ; curl http://localhost:3000/subscribeNotif

/**
 * This function queries the URL of the appartement.
 * It is responsible for downloading the relevant content to be
 * displayed to the user
 * @param {string} postLink
 */
const pushNotification = async (userId, apartId) => {
  try {
    let result = await models.Subscription.findOne({
      attributes: ["BrowserToken"],
      where: {
        UserId: userId
      }
    });

    var message = {
      data: {
        score: "850",
        time: "2:45"
      },
      token: result.dataValues.BrowserToken
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin
      .messaging()
      .send(message)
      .then(response => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch(error => {
        console.log("Error sending message:", error);
      });
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.log("Subscription has expired or is no longer valid: ", err);
    } else {
      throw err;
    }
    log.err(`push notification failed!`, err);
  }
};

module.exports = pushNotification;
