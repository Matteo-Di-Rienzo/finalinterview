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

// 2) (Optional) Manually advance to the next question
app.get('/api/sessions/:id/next', (req, res) => {
  try {
    const { question, done } = nextQuestion(req.params.id);
    res.json({ ok: true, sessionId: req.params.id, question, done });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// 3) Transcribe + pass to Vellum, then ADVANCE and return nextQuestion
// (Node 18+ has global Blob/File; if not, use: const { Blob, File } = require('node:buffer'))
// server/index.js (only the /api/transcribe route shown)
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: 'No file uploaded' });

    // ensure valid session; create if missing/invalid
    let sessionId = (req.body && req.body.sessionId) || req.query.sessionId || null;
    let askedQuestion;
    try {
      if (!sessionId) throw new Error('Missing');
      askedQuestion = getLastQuestion(sessionId);
    } catch {
      const created = createSession();
      sessionId = created.sessionId;
      askedQuestion = created.firstQuestion;
      console.warn('[transcribe] missing/invalid session; created', sessionId);
    }

    // build File from memory buffer
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

    // ---- Try STT and Vellum, but don't block advancing ----
    let transcript = '';
    let sttError = null;
    let vellumError = null;
    let vellumOutputs = [];
    let vellumText = '';

    if (!process.env.ELEVENLABS_API_KEY) {
      sttError = 'ELEVENLABS_API_KEY not set';
    } else {
      try {
        const stt = await elevenlabs.speechToText.convert({
          file,
          modelId: 'scribe_v1',
          tagAudioEvents: false,
          diarize: false,
        });
        transcript = stt?.text || '';
      } catch (e) {
        sttError = e?.response?.data?.detail || e?.message || String(e);
      }
    }

    try {
      if (!process.env.VELLUM_API_KEY) throw new Error('VELLUM_API_KEY not set');
      const outputs = await runWorkflow(transcript, askedQuestion);
      vellumOutputs = outputs || [];
      const first = outputs?.[0];
      vellumText = first?.value ?? first?.text ?? '';
    } catch (e) {
      // e.g., 429 quota exceeded
      vellumError = e?.response?.data?.detail || e?.message || String(e);
    }

    // ---- ALWAYS advance the pointer ----
    const { question: nextQuestionValue, done } = nextQuestion(sessionId);

    // Return 200 so the client can move on, but include errors for display
    return res.json({
      ok: !sttError && !vellumError,
      sessionId,
      askedQuestion,
      nextQuestion: nextQuestionValue,
      done,
      text: transcript,
      vellumOutputs,
      vellumText,
      errors: { stt: sttError, vellum: vellumError },
    });
  } catch (err) {
    console.error('[transcribe] fatal error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(port, () => console.log(`Server listening on :${port}`));
