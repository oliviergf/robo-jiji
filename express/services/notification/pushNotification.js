const axios = require("axios");
const models = require("../../models");
const logger = require("../../utils/logger");
const moment = require("moment");
const log = new logger();
const firebase = require("./firebase");
/**
 * This function queries the URL of the appartement.
 * It is responsible for downloading the relevant content to be
 * displayed to the user
 * @param {string} postLink
 */
const pushNotification = async (userId, apartId) => {
  try {
    console.log(process.env.PUBLIC_VAPID_KEY);
    console.log(process.env.PRIVATE_VAPID_KEY);
    webpush.setVapidDetails(
      "mailto:olivier.gauthier.farley@hotmail.com",
      process.env.PUBLIC_VAPID_KEY,
      process.env.PRIVATE_VAPID_KEY
    );

    const subscription = {
      endpoint:
        "https://fcm.googleapis.com/fcm/send/ezV6tD6ITEE:APA91bEw7ml13yY4Fnf98Z9UomLxcIm0VF89M6tWUngePGVi9JhnzNQmNFKpfikMdc3GuSIYcTvqzbqhDpj8Bk42jJzUvkAWWzlr34G0AWXsoAkbbi6F8N2OhIDrdlTtKnVRhtkI3inV",
      expirationTime: 100000,
      keys: {
        p256dh:
          "BKSdA3OEziuW_5ypjGB9i1cctZDdrftzAyRe2ALuxFPNsTibKPwfxGhL965-GgJAVW1f6xoupWLh0H08S7jRD3g",
        auth: "sLXzTeq5IgpxCHtOXdjRlg"
      }
    };

    const dataToSend = {
      notification: {
        title: "bob",
        body: "est tres chouette"
      }
    };
    await webpush.sendNotification(subscription, JSON.stringify(dataToSend));
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
