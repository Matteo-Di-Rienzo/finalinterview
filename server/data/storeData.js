let lastTranscript = '';

function setTranscript(text) {
  lastTranscript = text || '';
}

function getTranscript() {
  return lastTranscript;
}

module.exports = { setTranscript, getTranscript };
