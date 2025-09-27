import { useRef, useState, useEffect } from 'react';

export default function TranscribeMic() {
  const [status, setStatus] = useState('idle'); // idle | recording | sending | done | error
  const [result, setResult] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [done, setDone] = useState(false);
  const [sessionErr, setSessionErr] = useState('');
  const [startErr, setStartErr] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Start a session on mount
  useEffect(() => {
    (async () => {
      try {
        setSessionErr('');
        const res = await fetch('http://localhost:5000/api/session', { method: 'POST' });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        setSessionId(data.sessionId);
        setQuestion(data.question);
        setDone(false);
      } catch (e) {
        setSessionErr(e.message);
        console.error('Session create failed:', e);
      }
    })();
  }, []);

  const getPreferredMimeType = () => {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/mpeg',
    ];
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
  };

  const start = async () => {
    setStartErr('');
    setResult('');
    try {
      setStatus('recording');
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
        throw new Error(`Mic access failed: ${err.name || ''} ${err.message || ''}`.trim());
      });

      const mimeType = getPreferredMimeType();
      let mr;
      try {
        mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      } catch (err) {
        stream.getTracks().forEach(t => t.stop());
        throw new Error(`MediaRecorder error: ${err.message || err}`);
      }
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onerror = (e) => {
        setStartErr(`Recorder error: ${e.error?.message || String(e)}`);
        setStatus('error');
      };
      mr.onstop = async () => {
        try {
          setStatus('sending');
          if (chunksRef.current.length === 0 && mr.requestData) mr.requestData();
          const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
          await sendBlob(blob);
        } catch (e) {
          setStatus('error');
          setResult(String(e.message || e));
        } finally {
          stream.getTracks().forEach(t => t.stop());
        }
      };

      mr.start(500);
    } catch (e) {
      setStartErr(String(e.message || e));
      setStatus('error');
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const sendBlob = async (blob) => {
  const fd = new FormData();
  fd.append('sessionId', sessionId);
  fd.append('audio', new File([blob], 'recording.webm', { type: blob.type || 'audio/webm' }));

  let data;
  try {
    const res = await fetch('http://localhost:5000/api/transcribe', { method: 'POST', body: fd });
    data = await res.json().catch(() => ({}));

    // even if ok is false, server returns 200 with errors + nextQuestion
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

    // Only show the actual AI response, filter out error syntax
    let displayText = '';
    
    if (data.text) {
      // If we have the actual AI response, show it
      displayText = data.text;
    } else if (data.errors?.vellum) {
      // Check if the vellum error contains actual advice (not quota errors)
      const vellumError = data.errors.vellum;
      if (!vellumError.includes('Status code: 429') && 
          !vellumError.includes('Quota exceeded') && 
          !vellumError.includes('maximum of 25 per day')) {
        // This might be actual advice, not a quota error
        displayText = vellumError;
      } else {
        // It's a quota error, show a user-friendly message
        displayText = 'AI feedback is temporarily unavailable due to high usage. Please try again later.';
      }
    } else {
      // No text or errors, show default message
      displayText = 'Response recorded successfully.';
    }

    setStatus('done');
    setResult(displayText);

    if (data.sessionId && data.sessionId !== sessionId) setSessionId(data.sessionId);
    setQuestion(data.nextQuestion || null);   // will be null at end
    setDone(Boolean(data.done));
  } catch (e) {
    // Last-resort: still try to advance locally if server included nextQuestion
    if (data?.nextQuestion !== undefined) {
      setQuestion(data.nextQuestion);
      setDone(Boolean(data.done));
    }
    setStatus('error');
    setResult(String(e.message || e));
  }
};


  const sessionReady = Boolean(sessionId);
  const canRecord = sessionReady && !done && status !== 'sending' && status !== 'recording';

  return (
    <div className="transcribe-mic-container">
      <div className="transcribe-header">
        <div className="transcribe-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <h3>Practice Your Response</h3>
        <p className="transcribe-description">
          {question ? `Question: ${question}` : done ? 'All questions completed!' : 'Ready to start your practice session'}
        </p>
      </div>

      {sessionErr && <div className="error-message">Session error: {sessionErr}</div>}
      {startErr && <div className="error-message">Start error: {startErr}</div>}

      <div className="transcribe-controls">
        <button 
          className={`transcribe-button primary-button ${status === 'recording' ? 'recording' : ''}`}
          onClick={start} 
          disabled={!canRecord}
        >
          {status === 'recording' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
              Recording...
            </>
          ) : done ? (
            'All Done'
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
              Start Recording
            </>
          )}
        </button>
        
        <button 
          className="transcribe-button secondary-button"
          onClick={stop} 
          disabled={status !== 'recording'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
          </svg>
          Stop & Send
        </button>
      </div>

      <div className="transcribe-status">
        <div className={`status-indicator ${status}`}>
          <div className="status-dot"></div>
          <span>Status: {status}</span>
        </div>
      </div>

      {result && (
        <div className="transcribe-result">
          <h4>Your AI Feedback:</h4>
          <div className="result-text">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
