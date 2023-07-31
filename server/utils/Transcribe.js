const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");

async function transcribeAudioFile(filename) {
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
  return transcription;
}

module.exports = transcribeAudioFile;
