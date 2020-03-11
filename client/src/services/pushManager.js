//public vapid of our server!
import axios from "../services/axios";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/messaging";
const publicVapidKey =
  "BOQLXYjUt8HWl6E97BbqHlLKshkmBtkhCbNfyldQtesSJ9YRy4Ae2ymzOJoU2n8xMLjV327QjoYU-yt0MqdP54A";

/**
 * urlBase64ToUint8Array
 *
 * @param {string} base64String a public vavid key
 */
function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Let User know somehow that if they push ''block'' they'll need to disable it
 * in settings.
 */
export async function askPushPermission() {
  const firebaseConfig = {
    apiKey: "AIzaSyC9JEIuG4hy1njZN2ktyr93BTbs1A2PX3U",
    authDomain: "super-awesome-party.firebaseapp.com",
    databaseURL: "https://super-awesome-party.firebaseio.com",
    projectId: "super-awesome-party",
    storageBucket: "super-awesome-party.appspot.com",
    messagingSenderId: "875797832163",
    appId: "1:875797832163:web:3393363537c816b546c0d6",
    measurementId: "G-7GLFHNZGV7"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();
  // Add the public key generated from the console here.
  messaging.usePublicVapidKey(
    "BOQLXYjUt8HWl6E97BbqHlLKshkmBtkhCbNfyldQtesSJ9YRy4Ae2ymzOJoU2n8xMLjV327QjoYU-yt0MqdP54A"
  );
  messaging
    .getToken()
    .then(currentToken => {
      if (currentToken) {
        console.log(currentToken);
        console.log("also here");
        // sendTokenToServer(currentToken);
        // updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log(
          "No Instance ID token available. Request permission to generate one."
        );
        // Show permission UI.
        // updateUIForPushPermissionRequired();
        // setTokenSentToServer(false);
      }
    })
    .catch(err => {
      console.log("An error occurred while retrieving token. ", err);
      // showToken('Error retrieving Instance ID token. ', err);
      // setTokenSentToServer(false);
    });
  messaging.onMessage(payload => {
    console.log("Message received. ", payload);
    // ...
  });
}

export function subscribeUserToPush() {
  return navigator.serviceWorker
    .register("/service-worker.js")
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      console.log(
        "Received PushSubscription: ",
        JSON.stringify(pushSubscription)
      );
      sendSubscriptionToBackEnd(pushSubscription);
      return pushSubscription;
    })
    .catch(err => console.log(err));
}

/**
 * saves subscription to db
 */
const sendSubscriptionToBackEnd = subscription => {
  return axios
    .post("http://localhost:3000/subscribeNotif", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(subscription)
    })
    .then(function(response) {
      if (response.status !== 200) {
        throw new Error("Bad status code from server.");
      }

      return response;
    });
};
