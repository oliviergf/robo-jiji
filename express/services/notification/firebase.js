import * as firebase from "firebase/app";

// https://firebase.google.com/docs/cloud-messaging/js/client start from there,

// allright on a register lapp avec l'api de firebase mais la il faut suivre ce tutoriel
// https://firebase.google.com/docs/cloud-messaging
// on doit enable firebase-admin sur serveur? et enable fucking firebase client sur les clients pour faire marcher
// sinon ca Chie

// ca devrais theoriquement marcher car on a suivit le tutoriel de google avec web push;
// mais non car ca meurt silentieusement. peutetre essayer avec le FCM api key a la place de GCM?

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

firebase.initializeApp(firebaseConfig);

module.exports = firebase;
