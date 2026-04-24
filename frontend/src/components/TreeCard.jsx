import styles from './TreeCard.module.css';

export default function TreeCard({ hierarchy }) {
  const { root, tree, has_cycle, depth } = hierarchy;

  const renderNodes = (nodeData, parentKey = '') => {
    return Object.entries(nodeData).map(([key, children]) => (
      <div key={parentKey + key} className={styles.nodeWrapper}>
        <div className={styles.node}>
          <span className={styles.nodeDot} />
          <span className={styles.nodeKey}>{key}</span>
        </div>
        {Object.keys(children).length > 0 && (
          <div className={styles.children}>
            {renderNodes(children, parentKey + key)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.rootName}>{root}</span>
        {has_cycle ? (
          <span className={styles.badgeErr}>Cyclic</span>
        ) : (
          <span className={styles.badgeDim}>Depth {depth}</span>
        )}
      </div>
      <div className={styles.content}>
        {has_cycle ? (
          <span className={styles.cycleMsg}>Circular reference — no tree possible.</span>
        ) : (
          renderNodes(tree)
        )}
      </div>
    </div>
  );
}
