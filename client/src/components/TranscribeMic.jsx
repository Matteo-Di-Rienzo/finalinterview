import { useRef, useState } from 'react';

export default function TranscribeMic() {
  const [status, setStatus] = useState('idle'); // idle | recording | sending | done | error
  const [result, setResult] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Choose a supported mime type
  const getPreferredMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',           // Safari
      'audio/mpeg'           // (rarely supported for recording)
    ];
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
  };

  const start = async () => {
    setResult('');
    setStatus('recording');
    chunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = getPreferredMimeType();
    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = async () => {
      setStatus('sending');
      const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
      await sendBlob(blob);
      // stop tracks so mic icon turns off
      stream.getTracks().forEach(t => t.stop());
    };
    mr.start(1000); // collect chunks every second
  };

  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const sendBlob = async (blob) => {
    try {
      const fd = new FormData();
      // Give it a filename + type; backend uses field "audio"
      const ext = (blob.type.includes('webm') && 'webm') ||
                  (blob.type.includes('ogg') && 'ogg') ||
                  (blob.type.includes('mp4') && 'm4a') ||
                  'webm';
      fd.append('audio', new File([blob], `recording.${ext}`, { type: blob.type || 'audio/webm' }));

      const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus('done');
      setResult(data.text || JSON.stringify(data));
    } catch (e) {
      setStatus('error');
      setResult(e.message);
    }
  };

  return (
    <div style={{ border:'1px solid #ddd', padding:12, borderRadius:8 }}>
      <h3>Record mic → Transcribe</h3>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={start} disabled={status==='recording' || status==='sending'}>
          Start
        </button>
        <button onClick={stop} disabled={status!=='recording'}>
          Stop & Send
        </button>
      </div>
      <p style={{ marginTop:8 }}>Status: {status}</p>
      {result && <pre style={{ whiteSpace:'pre-wrap' }}>{result}</pre>}
    </div>
  );
}
