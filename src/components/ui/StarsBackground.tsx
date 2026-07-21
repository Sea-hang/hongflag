"use client";

import styles from "./StarsBackground.module.css";

export function StarsBackground() {
  return (
    <div className={styles.container}>
      <div className={styles.stars} />
      <div className={styles.stars2} />
      <div className={styles.stars3} />
    </div>
  );
}
