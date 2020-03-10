const axios = require("axios");
const models = require("../../models");
const logger = require("../../utils/logger");
const moment = require("moment");
const log = new logger();
const webpush = require("web-push");

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
        "https://fcm.googleapis.com/fcm/send/chuAaT8BxI4:APA91bE5vuImXqyCz3m5QyAkr6vD_-L63z89lWG1XN4hjq372Wx5BawPmYapu6IGuCLBKTu7ip63-lPlLVYMMG7v67ntTHGjI8h5rk2XFsaDsIoKMnp6xBF8FyEQDvuG1109UAJ4-FU9",
      expirationTime: 1000,
      keys: {
        p256dh:
          "BL9ijAiH1g6qwu8p-J61HH9kzdH5t1Hdgnh1Zg2imK6VZTJNRCGAbDZW-JWgUNXvEb7iiMz_q4qaLJV69rk6dHI",
        auth: "gCb8yhvArxeHpplwxca0OA"
      }
    };

    const dataToSend = {
      notification: {
        title: "bob",
        body: "est tres chouette"
      }
    };

    webpush.sendNotification(subscription, JSON.stringify(dataToSend));
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
