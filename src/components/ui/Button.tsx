import type { ButtonHTMLAttributes, ReactNode } from 'react';
import iconSpinner from '../../assets/icons/spinner.svg';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  startIcon,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true">
          <img src={iconSpinner} alt="" width={17} height={17} />
        </span>
      ) : startIcon ? (
        <span className={styles.icon}>{startIcon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
