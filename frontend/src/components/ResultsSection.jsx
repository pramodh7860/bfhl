import { useState } from 'react';
import TreeCard from './TreeCard';
import styles from './ResultsSection.module.css';

export default function ResultsSection({ data }) {
  const [rawOpen, setRawOpen] = useState(false);
  const { summary, hierarchies, invalid_entries, duplicate_edges } = data;

  const trees = hierarchies.filter(h => !h.has_cycle);
  const cycles = hierarchies.filter(h => h.has_cycle);

  return (
    <div className={styles.container}>
      <div className={styles.summaryBar}>
        <div className={styles.stat}>
          <span className={styles.statVal}>{summary.total_trees}</span>
          <span className={styles.statLab}>Hierarchies</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal}>{summary.total_cycles}</span>
          <span className={styles.statLab}>Cycles Detected</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statVal}>{summary.largest_tree_root || 'None'}</span>
          <span className={styles.statLab}>Primary Root</span>
        </div>
      </div>

      <div className={styles.grid}>
        {trees.length > 0 && (
          <div className={styles.group}>
            <h4 className={styles.groupTitle}>Structural Hierarchies</h4>
            <div className={styles.treeList}>
              {trees.map(h => <TreeCard key={h.root} hierarchy={h} />)}
            </div>
          </div>
        )}

        {cycles.length > 0 && (
          <div className={styles.group}>
            <h4 className={styles.groupTitle}>Cyclic Redundancies</h4>
            <div className={styles.treeList}>
              {cycles.map(h => <TreeCard key={h.root} hierarchy={h} />)}
            </div>
          </div>
        )}
      </div>

      {(invalid_entries?.length > 0 || duplicate_edges?.length > 0) && (
        <div className={styles.anomalies}>
          <h4 className={styles.groupTitle}>Data Anomalies</h4>
          <div className={styles.anomalyList}>
            {invalid_entries.map((e, i) => <span key={i} className={styles.tagErr}>{e || '(empty)'}</span>)}
            {duplicate_edges.map((e, i) => <span key={i} className={styles.tagWarn}>{e}</span>)}
          </div>
        </div>
      )}

      <div className={styles.debug}>
        <button className={styles.debugBtn} onClick={() => setRawOpen(!rawOpen)}>
          {rawOpen ? 'Hide' : 'View'} Raw Telemetry
        </button>
        {rawOpen && <pre className={styles.raw}>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}
