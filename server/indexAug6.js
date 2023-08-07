require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const transcribeAudioFile = require("./utils/Transcribe");
const stripeRoutes = require("./utils/Stripe");
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use("/stripe", stripeRoutes);

app.post(
  "/transcribe",
  bodyParser.json(),
  upload.single("audio"),
  async (req, res) => {
    try {
      const transcript = await transcribeAudioFile(
        req.file.path,
        req.body.userId,
        req.body.chatId,
        req.file.mimetype
      );
      res.json({ transcript: transcript });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.toString() });
    }
  }
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
