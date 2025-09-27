require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

// Public demo routes (no auth verification)
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/public', (_req, res) => res.json({ ok: true, message: 'Public endpoint' }));

// Example: pretend-secure route (still public for now)
app.get('/api/secure', (_req, res) => {
  res.json({ ok: true, message: 'Secure placeholder (no verification on server yet)' });
});


app.listen(port, () => console.log(`Server listening on :${port}`));
