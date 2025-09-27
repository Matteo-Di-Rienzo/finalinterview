require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Health + demo routes
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/public', (req, res) => res.json({ ok: true, message: 'Public endpoint' }));
app.get('/api/secure', (req, res) => res.json({ ok: true, message: 'Secure placeholder (no verification on server yet)' }));
app.get('/api/ping', (req, res) => res.json({ ok: true, message: 'test', serverTime: Date.now() }));

// 🔹 Transcribe endpoint: upload MP3 -> ElevenLabs STT
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    const filePath = path.resolve(req.file.path);

    // Build multipart form data using Node's FormData
    const formData = new FormData();
    formData.append('file', new Blob([fs.readFileSync(filePath)]), req.file.originalname);
    formData.append('model_id', 'eleven_multilingual_v2'); // adjust if needed

    // Send to ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ElevenLabs error: ${errText}`);
    }

    const data = await response.json();

    // Cleanup uploaded file
    fs.unlinkSync(filePath);

    res.json({ ok: true, text: data.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(port, () => console.log(`Server listening on :${port}`));
