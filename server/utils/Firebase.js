const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://audio-to-text-7ecf6-default-rtdb.firebaseio.com/",
});

const db = admin.firestore();

module.exports = {
  db,
};
