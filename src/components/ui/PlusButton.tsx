import styles from "./PlusButton.module.css";

export function PlusButton() {
  return (
    <div tabIndex={0} className={styles.plusButton}>
      <svg className={styles.plusIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
        <g mask="url(#mask0_21_345)">
          <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z" />
        </g>
      </svg>
    </div>
  );
}
