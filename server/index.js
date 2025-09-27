require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());


app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/public', (req, res) => res.json({ ok: true, message: 'Public endpoint' }));


app.get('/api/secure', (req, res) => {
  res.json({ ok: true, message: 'Secure placeholder (no verification on server yet)' });
});

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'test', serverTime: Date.now() });
});


app.listen(port, () => console.log(`Server listening on :${port}`));


