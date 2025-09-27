// server/sessionStore.js
const crypto = require('crypto');
const QUESTIONS = require('./questions');

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

  // At the end: no next question
  if (s.index >= QUESTIONS.length - 1) {
    return { question: null, done: true };
  }

  s.index += 1;
  s.lastQuestion = QUESTIONS[s.index];
  const done = s.index >= QUESTIONS.length - 1;
  return { question: s.lastQuestion, done };
}

function getLastQuestion(id) {
  const s = sessions.get(id);
  if (!s) throw new Error('Invalid session');
  return s.lastQuestion;
}

module.exports = { createSession, nextQuestion, getLastQuestion };
