let admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://super-awesome-party.firebaseio.com"
});

module.exports = admin;
