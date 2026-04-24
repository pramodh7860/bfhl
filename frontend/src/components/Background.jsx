import styles from './Background.module.css';

export default function Background() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.mesh} />
      <div className={styles.glow} />
    </div>
  );
}
