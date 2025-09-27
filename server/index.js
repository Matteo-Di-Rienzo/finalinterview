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

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    console.time('transcribe_total');
    console.log('[transcribe] content-type:', req.headers['content-type']);
    console.log('[transcribe] hasFile:', !!req.file, 'fileType:', req.file?.mimetype, 'fileSize:', req.file?.size);
    console.log('[transcribe] fields:', req.body, 'query:', req.query);

    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    // --- session handling (tolerant to server restarts) ---
    let sessionId = (req.body && (req.body.sessionId ?? req.body['sessionId'])) || req.query.sessionId || null;
    let question;
    try {
      if (!sessionId) throw new Error('Missing');
      question = getLastQuestion(sessionId);
    } catch {
      const created = createSession();
      sessionId = created.sessionId;
      question = created.firstQuestion;
      console.warn('[transcribe] invalid/missing session; created new', sessionId);
    }

    // --- build a proper File from memory buffer ---
    const declaredMime = (req.file.mimetype || '').split(';')[0];
    const lowerName = (req.file.originalname || '').toLowerCase();
    let mime = declaredMime && declaredMime !== 'application/octet-stream' ? declaredMime : '';
    if (!mime) {
      if (lowerName.endsWith('.webm')) mime = 'audio/webm';
      else if (lowerName.endsWith('.wav')) mime = 'audio/wav';
      else if (lowerName.endsWith('.ogg')) mime = 'audio/ogg';
      else if (lowerName.endsWith('.m4a') || lowerName.endsWith('.mp4')) mime = 'audio/mp4';
      else if (lowerName.endsWith('.mp3')) mime = 'audio/mpeg';
      else mime = 'audio/webm';
    }

    const filename =
      mime.includes('ogg') ? 'recording.ogg' :
      mime.includes('wav') ? 'recording.wav' :
      mime.includes('mpeg') ? 'recording.mp3' :
      mime.includes('mp4')  ? 'recording.m4a' : 'recording.webm';

    // Node 18+ has global File; if not, use require('node:buffer').File
    const file = new File([req.file.buffer], filename, { type: mime });

    // --- Dry run to debug UI without vendors ---
    if (req.query.dry === '1') {
      console.log('[transcribe] DRY RUN – skipping ElevenLabs & Vellum');
      console.timeEnd('transcribe_total');
      return res.json({
        ok: true,
        sessionId,
        question,
        text: '(dry) hello world',
        vellumOutputs: [],
        vellumText: '(dry)',
      });
    }

    const withTimeout = (p, ms, label) =>
      Promise.race([
        p,
        new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} timed out after ${ms} ms`)), ms)),
      ]);

    // --- ElevenLabs STT ---
    let transcript = '';
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn('[transcribe] ELEVENLABS_API_KEY missing – skipping STT');
      transcript = '(no ELEVENLABS_API_KEY)';
    } else {
      console.time('eleven_stt');
      console.log('[transcribe] calling ElevenLabs STT', { mime, filename });
      const stt = await withTimeout(
        elevenlabs.speechToText.convert({
          file,
          modelId: 'scribe_v1',
          tagAudioEvents: false,
          diarize: false,
        }),
        20000,
        'ElevenLabs STT'
      );
      console.timeEnd('eleven_stt');
      transcript = stt?.text || '';
      console.log('[transcribe] transcript length:', transcript.length);
    }

    // --- Vellum workflow ---
    console.time('vellum');
    const outputs = await withTimeout(
      runWorkflow(transcript, question),   // ensure this returns a value
      20000,
      'Vellum workflow'
    );
    console.timeEnd('vellum');

    const first = outputs?.[0];
    const vellumText = first?.value ?? first?.text ?? JSON.stringify(first ?? '');

    console.timeEnd('transcribe_total');
    return res.json({ ok: true, sessionId, question, text: transcript, vellumOutputs: outputs, vellumText });
  } catch (err) {
    console.error('[transcribe] error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});





app.listen(port, () => console.log(`Server listening on :${port}`));
