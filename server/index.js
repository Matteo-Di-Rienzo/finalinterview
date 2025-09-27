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
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    // Log what actually arrived
    console.log('[transcribe] content-type:', req.headers['content-type']);
    console.log('[transcribe] hasFile:', !!req.file, 'fileType:', req.file?.mimetype, 'fileSize:', req.file?.size);
    console.log('[transcribe] fields:', req.body, 'query:', req.query);

    // Safe access: req.body can be undefined if not multipart
    let sessionId = (req.body && (req.body.sessionId ?? req.body['sessionId'])) || req.query.sessionId || null;

    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    // If sessionId missing/invalid, you can auto-create to keep UX smooth
    let question;
    try {
      if (!sessionId) throw new Error('Missing');
      question = getLastQuestion(sessionId);
    } catch {
      const { sessionId: newId, firstQuestion } = createSession();
      sessionId = newId;
      question = firstQuestion;
      console.warn('[transcribe] invalid/missing session; created new', sessionId);
    }

    // ... continue with ElevenLabs/Vellum work ...
    return res.json({ ok: true, sessionId, question, text: '(skip for now)' });
  } catch (err) {
    console.error('[transcribe] error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});




app.listen(port, () => console.log(`Server listening on :${port}`));
