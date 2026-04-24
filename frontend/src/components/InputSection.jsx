import styles from './InputSection.module.css';

export default function InputSection({
  input,
  setInput,
  apiUrl,
  setApiUrl,
  loading,
  onSubmit,
  onExample,
  onClear,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Data Entry</h3>
          <p className={styles.subtitle}>Define your network edges</p>
        </div>
        <div className={styles.config}>
          <input
            className={styles.urlInput}
            type="text"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            placeholder="API Endpoint"
          />
        </div>
      </div>

      <div className={styles.body}>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. A->B, B->C"
          spellCheck={false}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Run Analysis'}
          </button>
          <button className={styles.btnSecondary} onClick={onExample}>Example</button>
          <button className={styles.btnSecondary} onClick={onClear}>Clear</button>
        </div>
      </div>
    </div>
  );
}
