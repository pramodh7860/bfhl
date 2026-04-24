import { useState, useCallback } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import Background from './components/Background';
import styles from './App.module.css';

const EXAMPLE = 'A->B, A->C, B->D, C->E, E->F, X->Y, Y->Z, Z->X, P->Q, Q->R, G->H, G->I';

export default function App() {
  const [input, setInput] = useState('');
  const [apiUrl, setApiUrl] = useState('http://localhost:3000/bfhl');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = useCallback(async () => {
    const raw = input.trim();
    if (!raw) { setError('Please enter at least one edge.'); return; }
    
    const data = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(apiUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      setError(`Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [input, apiUrl]);

  return (
    <div className={styles.app}>
      <Background />
      <div className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Nexus <span className={styles.gradient}>Architect</span>
          </h1>
          <p className={styles.desc}>
            Visualizing complex hierarchies with algorithmic precision.
          </p>
        </div>

        <div className={styles.content}>
          <InputSection
            input={input}
            setInput={setInput}
            apiUrl={apiUrl}
            setApiUrl={setApiUrl}
            loading={loading}
            onSubmit={handleSubmit}
            onExample={() => setInput(EXAMPLE)}
            onClear={() => { setInput(''); setError(''); setResult(null); }}
          />

          {error && <div className={styles.error}>{error}</div>}
          {result && <ResultsSection data={result} />}
        </div>

        <footer className={styles.footer}>
          &copy; 2026 Nexus Systems &bull; Built for Elite Engineers
        </footer>
      </div>
    </div>
  );
}
