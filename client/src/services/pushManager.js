//public vapid of our server!
import axios from "../services/axios";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/messaging";
import url from "../assets/serverURL";

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

/**
 * Let User know somehow that if they push ''block'' they'll need to disable it
 * in settings.
 */
export async function askPushPermission() {
  //request permission
  messaging
    .getToken()
    .then(currentToken => {
      if (currentToken) {
        sendSubscriptionToBackEnd(currentToken);
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

  messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(refreshedToken => {
        console.log("Token refreshed.");
        //todo: might want to implement logic here
        sendSubscriptionToBackEnd(refreshedToken);
        // ...
      })
      .catch(err => {
        console.log("Unable to retrieve refreshed token ", err);
      });
  });

  messaging.onMessage(payload => {
    console.log("Message received. ", payload);
    // ...
  });
}

/**
 * saves subscription to db
 */
const sendSubscriptionToBackEnd = userToken => {
  return axios
    .post(`${url}/subscribeNotif`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: userToken
    })
    .then(function(response) {
      if (response.status !== 200) {
        throw new Error("Bad status code from server.");
      }
      return response;
    });
};
