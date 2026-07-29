import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import styles from './Link.module.css';

type CommonProps = {
  children: ReactNode;
  tone?: 'primary' | 'muted';
  className?: string;
};

export type AppLinkProps = CommonProps &
  (
    | ({ to: RouterLinkProps['to'] } & Omit<RouterLinkProps, 'to' | 'className' | 'children'>)
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>)
    | ({ onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'] } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'className' | 'children' | 'onClick' | 'type'
      >)
  );

export function Link({ children, tone = 'primary', className, ...rest }: AppLinkProps) {
  const classNames = [styles.link, styles[tone], className ?? ''].filter(Boolean).join(' ');

  if ('to' in rest) {
    const { to, ...linkRest } = rest;
    return (
      <RouterLink to={to} className={classNames} {...linkRest}>
        {children}
      </RouterLink>
    );
  }

  if ('href' in rest) {
    const { href, ...anchorRest } = rest;
    return (
      <a href={href} className={classNames} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { onClick, ...buttonRest } = rest;
  return (
    <button type="button" className={classNames} onClick={onClick} {...buttonRest}>
      {children}
    </button>
  );
}
