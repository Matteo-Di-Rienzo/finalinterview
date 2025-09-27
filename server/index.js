require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Health/demo routes
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/public', (req, res) => res.json({ ok: true, message: 'Public endpoint' }));
app.get('/api/secure', (req, res) => res.json({ ok: true, message: 'Secure placeholder' }));
app.get('/api/ping', (req, res) => res.json({ ok: true, message: 'test', serverTime: Date.now() }));

// 🔹 Transcribe endpoint: upload MP3 -> ElevenLabs STT
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    const filePath = path.resolve(req.file.path);
    const audioBuffer = fs.readFileSync(filePath);
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });

    // Call ElevenLabs STT with correct params
    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: 'scribe_v1', // ✅ valid model
      tagAudioEvents: true, // optional
      languageCode: 'eng', // or null for auto-detect
      diarize: false, // set true if you want speaker separation
    });

    // Cleanup uploaded file
    fs.unlinkSync(filePath);

    res.json({ ok: true, text: transcription?.text || '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(port, () => console.log(`Server listening on :${port}`));
