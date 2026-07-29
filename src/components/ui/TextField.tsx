import { forwardRef } from 'react';
import { Input, type InputProps } from './Input';
import styles from './TextField.module.css';

export type TextFieldProps = {
  label: string;
  hint?: string;
  errorMessage?: string;
  id: string;
} & InputProps;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, errorMessage, id, hasError, endAdornment, ...inputProps },
  ref,
) {
  const describedBy = errorMessage
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined;

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.control}>
        <Input
          ref={ref}
          id={id}
          hasError={Boolean(errorMessage) || hasError}
          endAdornment={endAdornment}
          aria-invalid={Boolean(errorMessage) || undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
        {errorMessage ? (
          <p id={`${id}-error`} className={styles.error} role="alert">
            {errorMessage}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className={styles.hint}>
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
});
