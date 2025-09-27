require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const { createSession, nextQuestion, getLastQuestion } = require('./sessionStore');
const { runWorkflow } = require('./vellumExample');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'test connected', serverTime: Date.now() });
});

// 1) Start a session: returns first question
app.post('/api/session', (req, res) => {
  const { sessionId, firstQuestion } = createSession();
  res.json({ ok: true, sessionId, question: firstQuestion });
});

// 2) Get the next question (sequential order)
app.get('/api/sessions/:id/next', (req, res) => {
  try {
    const question = nextQuestion(req.params.id);
    res.json({ ok: true, sessionId: req.params.id, question });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// 3) Transcribe + send to Vellum using the *last* asked question
// server/index.js
// at top of server/index.js (Node 18+ has Blob/File; if not, uncomment polyfill)
// const { Blob, File } = require('node:buffer');

// if you ever run on Node < 18, uncomment next line:
// const { Blob, File } = require('node:buffer');

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    // ---- basic validation ----
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    // ---- session handling (robust to server restarts) ----
    let sessionId = (req.body && req.body.sessionId) || req.query.sessionId || null;
    let question;
    try {
      if (!sessionId) throw new Error('Missing');
      question = getLastQuestion(sessionId);
    } catch {
      const created = createSession();
      sessionId = created.sessionId;
      question = created.firstQuestion;
      console.warn('[transcribe] missing/invalid session; created', sessionId);
    }

    // ---- create a File from in-memory buffer ----
    const declared = (req.file.mimetype || '').split(';')[0];
    const name = (req.file.originalname || '').toLowerCase();
    let mime = declared && declared !== 'application/octet-stream' ? declared : '';
    if (!mime) {
      if (name.endsWith('.webm')) mime = 'audio/webm';
      else if (name.endsWith('.wav')) mime = 'audio/wav';
      else if (name.endsWith('.ogg')) mime = 'audio/ogg';
      else if (name.endsWith('.m4a') || name.endsWith('.mp4')) mime = 'audio/mp4';
      else if (name.endsWith('.mp3')) mime = 'audio/mpeg';
      else mime = 'audio/webm';
    }

    const filename =
      mime.includes('ogg') ? 'recording.ogg' :
      mime.includes('wav') ? 'recording.wav' :
      mime.includes('mpeg') ? 'recording.mp3' :
      mime.includes('mp4')  ? 'recording.m4a' : 'recording.webm';

    const file = new File([req.file.buffer], filename, { type: mime });

    // ---- ElevenLabs STT ----
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ ok: false, error: 'ELEVENLABS_API_KEY not set' });
    }

    const stt = await elevenlabs.speechToText.convert({
      file,
      modelId: 'scribe_v1',
      tagAudioEvents: false,
      diarize: false,
    });

    const transcript = stt?.text || '';

    // ---- Vellum workflow ----
    const outputs = await runWorkflow(transcript, question);
    const first = outputs?.[0];
    const vellumText = first?.value ?? first?.text ?? JSON.stringify(first ?? '');

    return res.json({
      ok: true,
      sessionId,
      question,
      text: transcript,
      vellumOutputs: outputs,
      vellumText,
    });
  } catch (err) {
    console.error('[transcribe] error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});






app.listen(port, () => console.log(`Server listening on :${port}`));
