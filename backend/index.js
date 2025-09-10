// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
const subscriptionKey = process.env.AZURE_KEY;
const region = process.env.AZURE_REGION || "centralindia";
const endpoint = "https://api.cognitive.microsofttranslator.com/translate";

app.post("/translate", async (req, res) => {
  try {
    const { text, input_lang, output_lang } = req.body;

    if (!text || !input_lang || !output_lang) {
      return res.status(400).json({
        error: "Invalid request. Provide { text, input_lang, output_lang }",
      });
    }

    // Step 1: Translate input → English
    const toEnglishParams = new URLSearchParams({
      "api-version": "3.0",
      from: input_lang,
      to: "en",
    });

    const toEnglishRes = await fetch(`${endpoint}?${toEnglishParams.toString()}`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Ocp-Apim-Subscription-Region": region,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ Text: text }]),
    });

    if (!toEnglishRes.ok) {
      const error = await toEnglishRes.text();
      return res
        .status(toEnglishRes.status)
        .json({ error: "translation failed", details: error });
    }

    const englishData = await toEnglishRes.json();
    const englishText = englishData[0].translations[0].text;

    // Step 2: Translate English → Output Language
    const toOutputParams = new URLSearchParams({
      "api-version": "3.0",
      from: "en",
      to: output_lang,
    });

    const toOutputRes = await fetch(`${endpoint}?${toOutputParams.toString()}`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Ocp-Apim-Subscription-Region": region,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ Text: englishText }]),
    });

    if (!toOutputRes.ok) {
      const error = await toOutputRes.text();
      return res
        .status(toOutputRes.status)
        .json({ error: "translation failed", details: error });
    }

    const outputData = await toOutputRes.json();
    const outputText = outputData[0].translations[0].text;

    // ✅ Fixed Final Response
    res.json({
      input: {
        input_text: text,
        input_lang,
      },
      output: {
        output_text: outputText,
        output_lang,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Translator Chatbot API is running");
});
