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


// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});
// use memory storage so there’s no disk confusion
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  console.log('HIT /api/transcribe');
  console.log('Headers:', req.headers['content-type']);
  console.log('File:', {
    name: req.file?.originalname,
    type: req.file?.mimetype,
    size: req.file?.size
  });

  if (!req.file) {
    console.log('❌ No file on request');
    return res.status(400).json({ ok: false, error: 'No file uploaded' });
  }

  // Don’t call ElevenLabs yet — just confirm upload roundtrip
  return res.json({
    ok: true,
    received: {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    }
  });
});



app.listen(port, () => console.log(`Server listening on :${port}`));
