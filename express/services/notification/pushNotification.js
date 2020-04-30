const models = require("../../models");
const logger = require("../../utils/logger");
const log = new logger();

let admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://super-awesome-party.firebaseio.com",
});

/**
 * This function queries the URL of the appartement.
 * It is responsible for downloading the relevant content to be
 * displayed to the user
 * @param {string} postLink
 */
const pushNotification = async (userId, newAparts) => {
  try {
    //todo: possibly multiples tokens here.
    let result = await models.Subscription.findOne({
      attributes: ["BrowserToken"],
      where: {
        UserId: userId,
      },
    });

    //user has no token
    if (!result) return;

    var message = {
      data: {
        aparts: JSON.stringify(newAparts),
      },
      token: result.dataValues.BrowserToken,
      webpush: {
        fcm_options: {
          link: "https://localhost:3001/Home",
        },
      },
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
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
