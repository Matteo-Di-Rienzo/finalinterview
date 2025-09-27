// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

// Initialize ElevenLabs client (SDK)
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Multer: keep uploads in memory (no disk files)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// POST /api/transcribe  -> accepts FormData field "audio"
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    console.log('HIT /api/transcribe');

    if (!req.file) {
      console.log('No file on request');
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    // Use the actual MIME from the browser upload; drop ";codecs=opus" if present
    const mime = (req.file.mimetype || 'audio/webm').split(';')[0];
    console.log('Received:', {
      name: req.file.originalname,
      type: mime,
      size: req.file.size,
    });

    // Build a Blob from the in-memory bytes and call ElevenLabs STT
    const fileBlob = new Blob([req.file.buffer], { type: mime });

    const transcription = await elevenlabs.speechToText.convert({
      file: fileBlob,
      modelId: 'scribe_v1',          // ✅ ElevenLabs STT model
      // languageCode: 'en',         // optional: let it auto-detect if you omit
      // diarize: false,             // optional
      // tagAudioEvents: false,      // optional
    });

    const text = transcription?.text || '';
    console.log('Transcript:', text.slice(0, 200) || '(empty)');

    return res.json({ ok: true, text });
  } catch (err) {
    console.error('💥 Server error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(port, () => console.log(`Server listening on :${port}`));
