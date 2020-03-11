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

// todo: mad fuck,checker dans firebase.js
// const firebase = require("./firebase");
/**
 * This function queries the URL of the appartement.
 * It is responsible for downloading the relevant content to be
 * displayed to the user
 * @param {string} postLink
 */
const pushNotification = async (userId, apartId) => {
  try {
    // //tried to add firebase vapid key but it failed
    // console.log(process.env.PUBLIC_VAPID_KEY);
    // console.log(process.env.PRIVATE_VAPID_KEY);
    // webpush.setGCMAPIKey("AIzaSyC9JEIuG4hy1njZN2ktyr93BTbs1A2PX3U");
    // webpush.setVapidDetails(
    //   "mailto:olivier.gauthier.farley@hotmail.com",
    //   process.env.PUBLIC_VAPID_KEY,
    //   process.env.PRIVATE_VAPID_KEY
    // );

    // const subscription = {
    //   endpoint:
    //     "https://fcm.googleapis.com/fcm/send/cVsqd_wZ4xQ:APA91bFjqtD9iLIanMbU0Xq27dR0e-qeLRjRU0MsfaxxxhGtsv3QE6ug9gHyTVE6lgBN7nl_9fY2eAWbzR_Tc8rhqo72XHr3s4KA6sLvTPKCOCR5jDDPfoA54jXLeNzG4Jse44aAgs_w",
    //   expirationTime: 1000,
    //   keys: {
    //     p256dh:
    //       "BH7dRFp8Cwi3zyAfwvMmlsT-fRHiSWM5JM_0OtQoGZHu2EFdRtu8IjQSMebidwqGqmx2oOLJq4eIEi2J0HRAYo0",
    //     auth: "dE0IvnY6a78RI18wb51f6g"
    //   }
    // };

    // const dataToSend = {
    //   notification: {
    //     title: "bob",
    //     body: "est tres chouette"
    //   }
    // };
    // await webpush.sendNotification(subscription, JSON.stringify(dataToSend));
    var registrationToken =
      "dwBU5MPFxgRZ-0Q7Hc-Q50:APA91bFMGwqLbKlnXKcCoqcM5W6IKCLK7SCzoeehislm5vwUD2nZNmhDbmSFcUpkzLUFyGL_IrayVC3NyxTfkw2M0mUbSW5pyoQaIB-aWeCQASFPUnWdG5Gjql-hZ8PLUzn0gzr0FlIX";

    var message = {
      data: {
        score: "850",
        time: "2:45"
      },
      token: registrationToken
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
