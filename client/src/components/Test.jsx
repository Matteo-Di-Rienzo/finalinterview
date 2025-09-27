import { useState } from 'react';

export default function TestConnection() {
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');

  const test = async () => {
    setStatus('loading');
    setMsg('');
    try {
      const res = await fetch('/api/ping');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus('ok');
      setMsg(`✅ Connected: ${data.message} @ ${new Date(data.serverTime).toLocaleTimeString()}`);
    } catch (e) {
      setStatus('error');
      setMsg(`❌ Failed: ${e.message}`);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={test} disabled={status === 'loading'}>
        {status === 'loading' ? 'Testing…' : 'Test Connection'}
      </button>
      <p style={{ marginTop: 8 }}>{msg}</p>
    </div>
  );
}
