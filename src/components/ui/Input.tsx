import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Input.module.css';

export type InputProps = {
  endAdornment?: ReactNode;
  hasError?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { endAdornment, hasError = false, className, ...rest },
  ref,
) {
  const classNames = [
    styles.field,
    hasError ? styles.error : '',
    endAdornment ? styles.withAdornment : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      <input ref={ref} className={styles.input} {...rest} />
      {endAdornment ? <div className={styles.adornment}>{endAdornment}</div> : null}
    </div>
  );
});
