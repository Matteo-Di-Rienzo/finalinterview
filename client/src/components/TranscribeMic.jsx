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

    // show transcript or vendor errors
    const vendorErrs = []
      .concat(data?.errors?.stt ? [`STT: ${data.errors.stt}`] : [])
      .concat(data?.errors?.vellum ? [`Advice: ${data.errors.vellum}`] : []);
    const info = vendorErrs.length ? `⚠️ ${vendorErrs.join(' | ')}` : '';

    setStatus(vendorErrs.length ? 'error' : 'done');
    setResult(data.text || info || 'Uploaded.');

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
    <div style={{ border:'1px solid #ddd', padding:12, borderRadius:8 }}>
      <h3>Record mic → Transcribe</h3>
      <p style={{margin:'4px 0', fontSize:12}}>
        Session: {sessionId || '—'}
        {question ? ` • Q: ${question}` : done ? ' • (No more questions)' : ''}
      </p>
      {sessionErr && <p style={{color:'crimson'}}>Session error: {sessionErr}</p>}
      {startErr && <p style={{color:'crimson'}}>Start error: {startErr}</p>}

      <div style={{ display:'flex', gap:8 }}>
        <button onClick={start} disabled={!canRecord}>
          {done ? 'All done' : 'Start'}
        </button>
        <button onClick={stop} disabled={status!=='recording'}>
          Stop &amp; Send
        </button>
      </div>

      <p style={{ marginTop:8 }}>Status: {status}</p>
      {result && <pre style={{ whiteSpace:'pre-wrap' }}>{result}</pre>}
    </div>
  );
}
