const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");
const db = require("./Firebase.js");
const fs = require("fs");
const { setDoc, doc } = require("firebase/firestore");
const ffmpeg = require("fluent-ffmpeg");

//ffmpeg.setFfmpegPath("/usr/local/opt/ffmpeg/bin/ffmpeg");
//ffmpeg.setFfmpegPath("/app/.heroku/ffmpeg/bin/ffmpeg");

async function transcribeAudioFile(filename, userId, chatId, mimetype) {
  console.log("chatId", chatId);
  let encodingType;
  let sampleRate = 16000;

  console.log("Received file:", filename);
  console.log("mimetype", mimetype);
  if (mimetype === "audio/mpeg") {
    encodingType = "MP3";
  } else if (mimetype === "audio/x-m4a" || mimetype === "audio/mp4") {
    await convertToWAV(filename);
    encodingType = "LINEAR16"; // encoding for WAV
    sampleRate = 48000;
  } else {
    throw new Error("Unsupported file type");
  }

  const keyContent = fs.readFileSync("./googleKey.json", "utf8");

  let transcription;
  const bucketName =
    "unique-bucket-name-" +
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2, 9);
  let storage;
  try {
    storage = new Storage({
      keyFilename: "./firebaseKey.json",
    });
  } catch (e) {
    console.log(e);
  }
  const [bucket] = await storage.createBucket(bucketName);
  const uploadFilename =
    mimetype === "audio/x-m4a" || mimetype === "audio/mp4"
      ? `${filename}.wav`
      : filename;
  const [file] = await bucket.upload(uploadFilename);
  const gcsUri = `gs://${bucketName}/${file.name}`;
  console.log(gcsUri);
  let client;
  try {
    client = new speech.SpeechClient({
      keyFilename: "./firebaseKey.json",
    });
  } catch (e) {
    console.log(e);
  }

  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: encodingType,
    sampleRateHertz: sampleRate,
    languageCode: "en-US",
  };
  const request = { audio: audio, config: config };
  console.log("Starting transcription");

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(transcription);
  console.log(`Transcript saved to users/${userId}/foldersAndChats/${chatId}`);
  try {
    // Create a reference to the Firestore document
    const docRef = db
      .collection("users")
      .doc(String(userId))
      .collection("foldersAndChats")
      .doc(String(chatId));

    // Set or merge data into that document
    await docRef.set({ transcript: transcription }, { merge: true });
  } catch (error) {
    console.error("Error saving transcript to Firestore: ", error);
  }
  if (mimetype === "audio/x-m4a" || mimetype === "audio/mp4") {
    fs.unlinkSync(`${filename}.wav`);
  }
  fs.unlinkSync(filename);

  const bucketReference = storage.bucket(bucketName);

  const [bucketExists] = await bucketReference.exists();

  if (bucketExists) {
    try {
      // Delete all files in the bucket first
      const [files] = await bucketReference.getFiles();
      await Promise.all(files.map((file) => file.delete()));

      // Now delete the bucket
      await bucketReference.delete();
      console.log(`Bucket ${bucketName} and all its files have been deleted.`);
    } catch (error) {
      console.error(`Failed to delete bucket ${bucketName}.`, error);
    }
  } else {
    console.warn(`Bucket ${bucketName} does not exist.`);
  }

  return transcription;
}

function convertToWAV(inputFile) {
  console.log("Starting WAV conversion");
  const outputFile = `${inputFile}.wav`;
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputFile)
      .toFormat("wav")
      .on("end", () => {
        console.log("Finished WAV conversion");
        resolve(outputFile);
      })
      .on("error", (err) => {
        console.error("Error converting file with FFmpeg:", err);
        reject(err);
      })
      .save(outputFile);
  });
}

module.exports = transcribeAudioFile;
