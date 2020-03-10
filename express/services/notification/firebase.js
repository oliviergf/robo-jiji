import * as firebase from "firebase/app";

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
