// server/sessionStore.js (CommonJS)
const crypto = require('crypto');
const QUESTIONS = require('./questions'); // <-- use your file

const sessions = new Map(); // id -> { index, lastQuestion }

function createSession() {
  const sessionId = crypto.randomUUID();
  const firstQuestion = QUESTIONS[0];
  sessions.set(sessionId, { index: 0, lastQuestion: firstQuestion });
  return { sessionId, firstQuestion };
}
function nextQuestion(id) {
  const s = sessions.get(id);
  if (!s) throw new Error('Invalid session');
  const nextIndex = Math.min(s.index + 1, QUESTIONS.length - 1);
  const q = QUESTIONS[nextIndex];
  s.index = nextIndex;
  s.lastQuestion = q;
  return q;
}
function getLastQuestion(id) {
  const s = sessions.get(id);
  if (!s) throw new Error('Invalid session');
  return s.lastQuestion;
}
module.exports = { createSession, nextQuestion, getLastQuestion };
