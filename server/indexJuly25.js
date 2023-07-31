require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");
const fs = require("fs");
const cors = require("cors");
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function transcribeAudioFile(filename, fileExtension) {
  let transcription;
  const bucketName =
    "unique-bucket-name-" +
    Date.now() +
    "-" +
    Math.random().toString(36).slice(2, 9);
  const storage = new Storage();
  const [bucket] = await storage.createBucket(bucketName);
  const [file] = await bucket.upload(filename);
  const gcsUri = `gs://${bucketName}/${file.name}`;
  try {
    console.log(`File uploaded to: ${gcsUri}`);
  } catch (err) {
    console.log(`Google Upload1: ${err}`);
    res.status(500).json({ error: err.toString() });
  }

  try {
    const client = new speech.SpeechClient();

    const audio = {
      uri: gcsUri,
    };
    const config = {
      encoding: "MP3",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    };
    const request = { audio: audio, config: config };
    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();
    transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(`Transcription: ${transcription}`);
  } catch (err) {
    console.log(`Google Transcription: ${err}`);
    res.status(500).json({ error: err.toString() });
  }
  return transcription;
}

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    let originalName = req.file.originalname;
    let fileExtension = originalName.split(".").pop();
    const transcript = await transcribeAudioFile(req.file.path, fileExtension);
    res.json({ transcript: transcript });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
