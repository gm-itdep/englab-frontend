import type { HTMLAttributes } from 'react';
import iconCheckmark from '../../assets/icons/checkmark.svg';
import styles from './Notice.module.css';

export type NoticeProps = {
  children: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export function Notice({ children, className, ...rest }: NoticeProps) {
  const classNames = [styles.notice, className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="status" {...rest}>
      <span className={styles.icon} aria-hidden="true">
        <img src={iconCheckmark} alt="" width={14} height={14} />
      </span>
      <p className={styles.text}>{children}</p>
    </div>
  );
}
