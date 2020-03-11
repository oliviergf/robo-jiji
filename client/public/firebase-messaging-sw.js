// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyC9JEIuG4hy1njZN2ktyr93BTbs1A2PX3U",
  authDomain: "super-awesome-party.firebaseapp.com",
  databaseURL: "https://super-awesome-party.firebaseio.com",
  projectId: "super-awesome-party",
  storageBucket: "super-awesome-party.appspot.com",
  messagingSenderId: "875797832163",
  appId: "1:875797832163:web:3393363537c816b546c0d6",
  measurementId: "G-7GLFHNZGV7"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
