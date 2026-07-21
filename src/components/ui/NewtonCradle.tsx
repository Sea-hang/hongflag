"use client";

import styles from "./NewtonCradle.module.css";

export function NewtonCradle() {
  return (
    <div className={styles.cradle}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
}
