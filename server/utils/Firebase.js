const admin = require("firebase-admin");
const serviceAccount = require("../firebaseKey.json");

admin.initializeApp({
  credentials: admin.credential.cert(serviceAccount),
  databaseURL: "https://audio-to-text-7ecf6-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

if (admin.apps.length) {
  console.log("Firebase Admin SDK initialized successfully!");
  console.log("Using Firebase Project ID:", serviceAccount.project_id);
} else {
  console.error("Failed to initialize Firebase Admin SDK.");
}

module.exports = db;
