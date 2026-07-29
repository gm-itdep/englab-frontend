import styles from './Separator.module.css';

export type SeparatorProps = {
  label: string;
};

export function Separator({ label }: SeparatorProps) {
  return (
    <div className={styles.root} role="separator" aria-label={label}>
      <span className={styles.line} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      <span className={styles.line} aria-hidden="true" />
    </div>
  );
}
