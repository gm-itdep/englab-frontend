import type { HTMLAttributes } from 'react';
import iconAttention from '../../assets/icons/attention.svg';
import styles from './Alert.module.css';

export type AlertProps = {
  children: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export function Alert({ children, className, ...rest }: AlertProps) {
  const classNames = [styles.alert, className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="alert" {...rest}>
      <span className={styles.icon} aria-hidden="true">
        <img src={iconAttention} alt="" width={14} height={14} />
      </span>
      <p className={styles.text}>{children}</p>
    </div>
  );
}
