import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { TextField } from '../../components/ui';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import styles from './AdminUsersPage.module.css';

import LOGO_COMPACT from '../../assets/icons/admin/05f06da7-da57-4718-bf22-90a176ac3523.svg';
import LOGO_FULL from '../../assets/icons/admin/326a0b15-9c90-411c-8b53-3c1d538d3da9.svg';
import ICON_HOME from '../../assets/icons/admin/734d5e33-5e2d-4a6a-a1ea-a956aed5984d.svg';
import ICON_USERS from '../../assets/icons/admin/ddbf7ea0-8bd0-4175-88a3-d7706f401df7.svg';
import ICON_LESSONS from '../../assets/icons/admin/350ef0ca-32e0-46cf-bc47-2f1b28d93ade.svg';
import ICON_FINANCE from '../../assets/icons/admin/6d1ac038-b3de-4db1-abcf-da4ccd1fa4b7.svg';
import ICON_EXIT from '../../assets/icons/admin/0156cecf-0b9d-448b-8e1e-62c6859c6fc3.svg';
import ICON_NOTIFICATION from '../../assets/icons/admin/40f79c9c-cae5-474f-931e-464f5a9dae78.svg';
import ICON_CHEVRON from '../../assets/icons/admin/dbe9bd54-fd9c-4a89-a289-98950ea9cffa.svg';
import AVATAR from '../../assets/images/admin/da13fe3f-3c26-4838-9f87-50e819b11e60.png';
import MOBILE_AVATAR from '../../assets/images/admin/abfd45ff-f19a-4cda-b003-ba4e8f05fe56.png';
import MOBILE_ICON_HOME from '../../assets/icons/admin/c87f92f3-d0a2-417b-bc56-7fe57c84693a.svg';
import MOBILE_ICON_USERS from '../../assets/icons/admin/11d24a82-2cc3-49e3-a1d9-bbb46beda238.svg';
import MOBILE_ICON_LESSONS from '../../assets/icons/admin/e9c6ab6f-81c4-4be0-ac22-90f0382426a1.svg';
import MOBILE_ICON_FINANCE from '../../assets/icons/admin/47ab14b6-6f95-4839-8c25-b62c1aa4d669.svg';
import ICON_SEARCH from '../../assets/icons/admin/users/search.svg';
import ICON_FILTER from '../../assets/icons/admin/users/filter.svg';
import ICON_ARROW_LITE from '../../assets/icons/admin/users/arrow-lite.svg';
import ICON_SORT from '../../assets/icons/admin/users/sort.svg';
import ICON_DOTS from '../../assets/icons/admin/users/dots.svg';
import ICON_PENCIL from '../../assets/icons/admin/users/pencil.svg';
import ICON_CLOSE from '../../assets/icons/admin/users/close.svg';
import ICON_PAGE_DOTS from '../../assets/icons/admin/users/arrow-page.svg';
import ICON_MODAL_CLOSE from '../../assets/icons/modal-close.svg';
import ICON_EMPTY_PERSON from '../../assets/icons/admin/users/empty-person.svg';
import ICON_CHECK_MARK from '../../assets/icons/admin/users/check-mark.svg';
import ROW_AVATAR from '../../assets/images/admin/users/row-avatar.png';

import {
  EDIT_ROLE_OPTIONS,
  getAdminUsers,
  PAGE_SIZE,
  ROLE_FILTER_ALL,
  ROLE_FILTER_OPTIONS,
  ROLE_LABELS,
  STATUS_LABELS,
  roleMatchesFilter,
  splitUserName,
  type AdminUser,
  type UserRole,
} from './usersData';

const ADMIN_NAME = 'Пётр Васильев';

type RoleFilter = (typeof ROLE_FILTER_OPTIONS)[number];

function SidebarItem({
  icon,
  label,
  to,
  active = false,
  onClick,
}: {
  icon: string;
  label: string;
  to?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const className = [styles.sidebarItem, active ? styles.sidebarItemActive : ''].filter(Boolean).join(' ');
  const content = (
    <>
      <span className={styles.sidebarIconWrap}>
        <img src={icon} alt="" width={22.4} height={22.4} />
      </span>
      <span className={styles.sidebarLabel}>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className} aria-current={active ? 'page' : undefined} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} aria-label={label} onClick={onClick}>
      {content}
    </button>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const tone =
    role === 'student' ? styles.badgeStudent : role === 'teacher' ? styles.badgeTeacher : styles.badgeAdmin;

  return <span className={[styles.badge, tone].join(' ')}>{ROLE_LABELS[role]}</span>;
}

function StatusBadge({ status }: { status: AdminUser['status'] }) {
  return <span className={[styles.badge, styles.badgeStatus].join(' ')}>{STATUS_LABELS[status]}</span>;
}

function RoleSelect({
  value,
  onChange,
}: {
  value: RoleFilter;
  onChange: (value: RoleFilter) => void;
}) {
  return (
    <CustomSelect
      value={value}
      options={ROLE_FILTER_OPTIONS.map((option) => ({ value: option, label: option }))}
      onChange={onChange}
      ariaLabel="Роль"
    />
  );
}

function CustomSelect<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  id,
  className,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
  id?: string;
  className?: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className={[styles.selectWrap, className].filter(Boolean).join(' ')} ref={rootRef}>
      <button
        type="button"
        id={id}
        className={[styles.select, open ? styles.selectOpen : ''].filter(Boolean).join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selectedLabel}</span>
        <span className={[styles.selectIcon, open ? styles.selectIconOpen : ''].filter(Boolean).join(' ')}>
          <img src={ICON_ARROW_LITE} alt="" width={14} height={14} />
        </span>
      </button>
      {open ? (
        <ul id={listId} className={styles.selectDropdown} role="listbox" aria-label={ariaLabel}>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[styles.selectOption, selected ? styles.selectOptionSelected : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function RowActions({
  open,
  onToggle,
  onEdit,
}: {
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  return (
    <div className={styles.actionsCell}>
      <button
        type="button"
        className={styles.dotsButton}
        aria-label="Действия"
        aria-expanded={open}
        onClick={onToggle}
      >
        <img src={ICON_DOTS} alt="" width={20} height={20} />
      </button>
      {open ? (
        <div className={styles.actionsMenu} role="menu">
          <button
            type="button"
            className={styles.actionEdit}
            aria-label="Редактировать"
            role="menuitem"
            onClick={onEdit}
          >
            <span className={styles.actionIcon}>
              <img src={ICON_PENCIL} alt="" width={14} height={14} />
            </span>
          </button>
          <button type="button" className={styles.actionDelete} aria-label="Удалить" role="menuitem">
            <span className={styles.actionIcon}>
              <img src={ICON_CLOSE} alt="" width={14} height={14} />
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AccountFormModal({
  mode,
  user,
  onClose,
  onSubmit,
}: {
  mode: 'create' | 'edit';
  user?: AdminUser;
  onClose: () => void;
  onSubmit: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password?: string;
  }) => void;
}) {
  const titleId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordConfirmId = useId();
  const roleId = useId();
  const initialNames = splitUserName(user?.name ?? '');
  const [firstName, setFirstName] = useState(initialNames.firstName);
  const [lastName, setLastName] = useState(initialNames.lastName);
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'teacher');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const isCreate = mode === 'create';
  const requiredMessage = 'Поле обязательно';

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleSubmit = () => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const nextFirstError = trimmedFirst ? '' : requiredMessage;
    const nextLastError = trimmedLast ? '' : requiredMessage;
    let nextPasswordError = '';
    let nextPasswordConfirmError = '';

    if (!password) nextPasswordError = requiredMessage;
    if (!passwordConfirm) nextPasswordConfirmError = requiredMessage;
    else if (password && passwordConfirm !== password) {
      nextPasswordConfirmError = 'Пароли не совпадают';
    }

    setFirstNameError(nextFirstError);
    setLastNameError(nextLastError);
    setPasswordError(nextPasswordError);
    setPasswordConfirmError(nextPasswordConfirmError);
    if (nextFirstError || nextLastError || nextPasswordError || nextPasswordConfirmError) return;

    onSubmit({
      firstName: trimmedFirst,
      lastName: trimmedLast,
      email: email.trim() || (isCreate ? 'example@example.ru' : (user?.email ?? '')),
      role,
      password,
    });
  };

  return (
    <div
      className={styles.editOverlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.editModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.editModalBody}>
          <div className={styles.editModalHeader}>
            <h2 id={titleId} className={styles.editModalTitle}>
              {isCreate ? 'Создать аккаунт' : 'Редактировать аккаунт'}
            </h2>
            <button type="button" className={styles.editModalClose} aria-label="Закрыть" onClick={onClose}>
              <img src={ICON_MODAL_CLOSE} alt="" width={16.8} height={16.8} />
            </button>
          </div>
          <div className={styles.editModalFields}>
            <TextField
              id={firstNameId}
              label="Имя"
              placeholder="Введите имя"
              value={firstName}
              errorMessage={firstNameError || undefined}
              onChange={(event) => {
                setFirstName(event.target.value);
                if (firstNameError) setFirstNameError('');
              }}
              autoComplete="given-name"
            />
            <TextField
              id={lastNameId}
              label="Фамилия"
              placeholder="Введите фамилию"
              value={lastName}
              errorMessage={lastNameError || undefined}
              onChange={(event) => {
                setLastName(event.target.value);
                if (lastNameError) setLastNameError('');
              }}
              autoComplete="family-name"
            />
            <TextField
              id={emailId}
              label="Email"
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <TextField
              id={passwordId}
              label="Пароль"
              type="password"
              placeholder="Введите пароль"
              value={password}
              errorMessage={passwordError || undefined}
              onChange={(event) => {
                setPassword(event.target.value);
                if (passwordError) setPasswordError('');
                if (passwordConfirmError && event.target.value === passwordConfirm) {
                  setPasswordConfirmError('');
                }
              }}
              autoComplete="new-password"
            />
            <TextField
              id={passwordConfirmId}
              label="Повтор пароля"
              type="password"
              placeholder="Повторите пароль"
              value={passwordConfirm}
              errorMessage={passwordConfirmError || undefined}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
                if (passwordConfirmError) setPasswordConfirmError('');
              }}
              autoComplete="new-password"
            />
            <div className={styles.editRoleField}>
              <label className={styles.editRoleLabel} htmlFor={roleId}>
                Роль
              </label>
              <CustomSelect
                id={roleId}
                className={styles.editRoleSelectWrap}
                value={role}
                options={EDIT_ROLE_OPTIONS}
                onChange={setRole}
                ariaLabel="Роль"
              />
            </div>
          </div>
        </div>
        <div className={styles.editModalActions}>
          <button type="button" className={styles.editCancelButton} onClick={onClose}>
            Отмена
          </button>
          <button type="button" className={styles.editSaveButton} onClick={handleSubmit}>
            {isCreate ? 'Создать аккаунт' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountCreatedModal({
  account,
  onClose,
  onCreateAnother,
}: {
  account: { firstName: string; lastName: string; email: string; role: UserRole };
  onClose: () => void;
  onCreateAnother: () => void;
}) {
  const titleId = useId();
  const displayName = [account.lastName, account.firstName].filter(Boolean).join(' ');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className={styles.editOverlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.createdModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.createdTop}>
          <div className={styles.createdIconRow}>
            <div className={styles.createdIcon}>
              <img src={ICON_CHECK_MARK} alt="" width={44.8} height={44.8} />
            </div>
            <button type="button" className={styles.createdClose} aria-label="Закрыть" onClick={onClose}>
              <img src={ICON_MODAL_CLOSE} alt="" width={22.4} height={22.4} />
            </button>
          </div>
          <div className={styles.createdText}>
            <p id={titleId} className={styles.createdTitle}>
              Аккаунт создан
            </p>
            <p className={styles.createdDesc}>Аккаунт успешно создан.</p>
          </div>
        </div>
        <div className={styles.createdDetails}>
          <div className={styles.createdDetailRow}>
            <span className={styles.createdDetailLabel}>Имя</span>
            <span className={styles.createdDetailValue}>{displayName}</span>
          </div>
          <div className={styles.createdDetailRow}>
            <span className={styles.createdDetailLabel}>Email</span>
            <span className={styles.createdDetailValue}>{account.email}</span>
          </div>
          <div className={styles.createdDetailRow}>
            <span className={styles.createdDetailLabel}>Роль</span>
            <span className={styles.createdDetailValue}>{ROLE_LABELS[account.role]}</span>
          </div>
        </div>
        <div className={styles.createdActions}>
          <button type="button" className={styles.editCancelButton} onClick={onCreateAnother}>
            Создать ещё
          </button>
          <button type="button" className={styles.editSaveButton} onClick={onClose}>
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const maxButtons = Math.min(totalPages, 3);
  let start = Math.max(1, Math.min(page - 1, totalPages - maxButtons + 1));
  if (page <= 2) start = 1;
  const pages = Array.from({ length: maxButtons }, (_, index) => start + index);

  const goTo = (next: number) => {
    const clamped = Math.min(totalPages, Math.max(1, next));
    if (clamped !== page) onChange(clamped);
  };

  return (
    <nav className={styles.pagination} aria-label="Пагинация">
      <button
        type="button"
        className={styles.pageArrow}
        aria-label="Предыдущая страница"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        <img src={ICON_ARROW_LITE} alt="" width={14} height={14} className={styles.pageArrowPrev} />
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={[styles.pageBtn, page === pageNumber ? styles.pageBtnActive : '']
            .filter(Boolean)
            .join(' ')}
          aria-current={page === pageNumber ? 'page' : undefined}
          onClick={() => goTo(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      {totalPages > 3 && start + maxButtons - 1 < totalPages ? (
        <span className={styles.pageEllipsis} aria-hidden>
          <img src={ICON_PAGE_DOTS} alt="" width={22.4} height={3.2} />
        </span>
      ) : null}
      <button
        type="button"
        className={styles.pageArrow}
        aria-label="Следующая страница"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
      >
        <img src={ICON_ARROW_LITE} alt="" width={14} height={14} className={styles.pageArrowNext} />
      </button>
    </nav>
  );
}

function MobileBottomNav() {
  const items: Array<{ icon: string; label: string; to?: string; active: boolean }> = [
    { icon: MOBILE_ICON_HOME, label: 'Главная', to: '/home', active: false },
    { icon: MOBILE_ICON_USERS, label: 'Пользователи', to: '/users', active: true },
    { icon: MOBILE_ICON_LESSONS, label: 'Уроки', to: '/lessons', active: false },
    { icon: MOBILE_ICON_FINANCE, label: 'Финансы', to: '/finance', active: false },
  ];

  return (
    <nav className={styles.mobileBottomNav} aria-label="Мобильная навигация">
      {items.map((item) => {
        const className = [styles.mobileBottomItem, item.active ? styles.mobileBottomItemActive : '']
          .filter(Boolean)
          .join(' ');
        const content = (
          <>
            <span className={styles.mobileBottomIcon}>
              <img src={item.icon} alt="" width={22.4} height={22.4} />
            </span>
            <span className={styles.mobileBottomLabel}>{item.label}</span>
          </>
        );

        if (item.to) {
          return (
            <Link key={item.label} to={item.to} className={className} aria-current={item.active ? 'page' : undefined}>
              {content}
            </Link>
          );
        }

        return (
          <button key={item.label} type="button" className={className}>
            {content}
          </button>
        );
      })}
    </nav>
  );
}

function UserMobileCard({
  user,
  menuOpen,
  onToggleMenu,
  onEdit,
}: {
  user: AdminUser;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
}) {
  return (
    <article className={styles.userCard}>
      <div className={styles.userCardTop}>
        <div className={styles.userCardProfile}>
          <img src={ROW_AVATAR} alt="" className={styles.userCardAvatar} width={40} height={40} />
          <div className={styles.userCardIdentity}>
            <p className={styles.userCardName}>{user.name}</p>
            <p className={styles.userCardEmail}>{user.email}</p>
          </div>
        </div>
        <RowActions open={menuOpen} onToggle={onToggleMenu} onEdit={onEdit} />
      </div>
      <div className={styles.userCardBadges}>
        <RoleBadge role={user.role} />
        <StatusBadge status={user.status} />
      </div>
      <div className={styles.userCardMeta}>
        <div className={styles.userCardMetaItem}>
          <span className={styles.userCardMetaLabel}>Дата регистрации</span>
          <span className={styles.userCardMetaValueAccent}>{user.registeredAt}</span>
        </div>
        <div className={styles.userCardMetaItem}>
          <span className={styles.userCardMetaLabel}>Последний вход</span>
          <span className={styles.userCardMetaValue}>{user.lastLoginAt}</span>
        </div>
      </div>
    </article>
  );
}

export function AdminUsersPage() {
  const session = getSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previewEmpty = searchParams.get('empty') === '1';
  const [search, setSearch] = useState(() => (previewEmpty ? 'Анна' : ''));
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(() =>
    previewEmpty ? 'Студенты' : ROLE_FILTER_ALL,
  );
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [users, setUsers] = useState(() => getAdminUsers());
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  } | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      if (!roleMatchesFilter(user.role, roleFilter)) return false;
      if (!query) return true;
      return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
    setOpenMenuId(null);
  }, [search, roleFilter]);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const openEdit = (user: AdminUser) => {
    setOpenMenuId(null);
    setEditingUser(user);
  };

  const handleSaveUser = (payload: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password?: string;
  }) => {
    if (!editingUser) return;
    const name = [payload.firstName, payload.lastName].filter(Boolean).join(' ');
    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUser.id
          ? { ...user, name, email: payload.email, role: payload.role }
          : user,
      ),
    );
    setEditingUser(null);
  };

  const handleCreateUser = (payload: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password?: string;
  }) => {
    const date = '15 февраля 2026';
    const name = [payload.firstName, payload.lastName].filter(Boolean).join(' ');
    setUsers((prev) => [
      {
        id: `user-${Date.now()}`,
        name,
        email: payload.email,
        role: payload.role,
        status: 'active',
        registeredAt: date,
        lastLoginAt: date,
      },
      ...prev,
    ]);
    setCreateOpen(false);
    setCreatedAccount({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
    });
  };

  const hasActiveFilters = search.trim().length > 0 || roleFilter !== ROLE_FILTER_ALL;
  const isEmptyResults = filtered.length === 0;

  const resetFilters = () => {
    setSearch('');
    setRoleFilter(ROLE_FILTER_ALL);
    setOpenMenuId(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="Навигация">
          <div className={styles.logoWrap}>
            <img src={LOGO_COMPACT} alt="" className={styles.logoCompact} width={37.787} height={25.532} />
            <img src={LOGO_FULL} alt="EngLab" className={styles.logoFull} width={109.769} height={27.377} />
          </div>
          <div className={styles.sidebarBody}>
            <div className={styles.sidebarTop}>
              <SidebarItem icon={ICON_HOME} label="Главная" to="/home" />
              <SidebarItem icon={ICON_USERS} label="Пользователи" to="/users" active />
              <SidebarItem icon={ICON_LESSONS} label="Уроки" to="/lessons" />
              <SidebarItem icon={ICON_FINANCE} label="Финансы" to="/finance" />
            </div>
            <div className={styles.sidebarBottom}>
              <div className={styles.sidebarSpacer} />
              <SidebarItem icon={ICON_EXIT} label="Выйти" onClick={handleLogout} />
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.headingWrap}>
              <h1 className={styles.pageTitle}>Пользователи</h1>
              <p className={styles.pageSubtitle}>Управление аккаунтами и&nbsp;доступом</p>
            </div>
            <div className={styles.topbarActions}>
              <button type="button" className={styles.notificationButton} aria-label="Уведомления">
                <span className={styles.notificationIcon}>
                  <img src={ICON_NOTIFICATION} alt="" width={22.4} height={22.4} />
                </span>
              </button>
              <button type="button" className={styles.userChip} aria-label={ADMIN_NAME}>
                <span className={styles.userProfile}>
                  <img src={AVATAR} alt="" className={styles.avatar} width={32} height={32} />
                  <span className={styles.userName}>{ADMIN_NAME}</span>
                </span>
                <span className={styles.chevronWrap}>
                  <img src={ICON_CHEVRON} alt="" width={9} height={5} />
                </span>
              </button>
              <button type="button" className={styles.mobileAvatarButton} aria-label={ADMIN_NAME}>
                <img src={MOBILE_AVATAR} alt="" width={32} height={32} className={styles.mobileAvatarImage} />
              </button>
            </div>
          </header>

          <section className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <label
                className={[styles.searchField, search.trim() ? styles.searchFieldActive : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                {search.trim() ? null : (
                  <span className={styles.searchIcon}>
                    <img src={ICON_SEARCH} alt="" width={14} height={14} />
                  </span>
                )}
                <input
                  type="search"
                  className={styles.searchInputDesktop}
                  placeholder="Поиск по имени или фамилии"
                  aria-label="Поиск по имени или фамилии"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <input
                  type="search"
                  className={styles.searchInputMobile}
                  placeholder="Поиск по имени студента"
                  aria-label="Поиск по имени студента"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className={styles.toolbarDesktopExtras}>
                <RoleSelect value={roleFilter} onChange={setRoleFilter} />
              </div>
              <button type="button" className={styles.filterButton} aria-label="Фильтры">
                <img src={ICON_FILTER} alt="" width={24} height={23} />
              </button>
            </div>
            <button type="button" className={styles.createButton} onClick={() => setCreateOpen(true)}>
              Создать аккаунт
            </button>
          </section>

          {hasActiveFilters ? (
            <div className={styles.foundRow} aria-live="polite">
              <span className={styles.foundLabel}>Найдено:</span>
              <span className={styles.foundCount}>{filtered.length}</span>
            </div>
          ) : null}

          {isEmptyResults ? (
            <section className={styles.emptyCard} aria-label="Результаты поиска">
              <div className={styles.emptyContent}>
                <div className={styles.emptyIcon}>
                  <img src={ICON_EMPTY_PERSON} alt="" width={70} height={70} />
                </div>
                <div className={styles.emptyText}>
                  <p className={styles.emptyTitle}>Ничего не найдено</p>
                  <p className={styles.emptyDesc}>
                    По вашему запросу и выбранным фильтрам пользователей нет.
                  </p>
                </div>
              </div>
              {hasActiveFilters ? (
                <div className={styles.emptyActions}>
                  <button type="button" className={styles.resetFiltersButton} onClick={resetFilters}>
                    Сбросить фильтры
                  </button>
                </div>
              ) : null}
            </section>
          ) : (
            <>
              <section className={styles.tableCard}>
                <div className={styles.tableScroll}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>
                          <span className={styles.thContent}>
                            Пользователь
                            <img src={ICON_SORT} alt="" width={11.2} height={11.2} />
                          </span>
                        </th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>
                          <span className={styles.thContent}>
                            Статус
                            <img src={ICON_SORT} alt="" width={11.2} height={11.2} />
                          </span>
                        </th>
                        <th>
                          <span className={styles.thContent}>
                            Дата регистрации
                            <img src={ICON_SORT} alt="" width={11.2} height={11.2} />
                          </span>
                        </th>
                        <th>
                          <span className={styles.thContent}>
                            Последний вход
                            <img src={ICON_SORT} alt="" width={11.2} height={11.2} />
                          </span>
                        </th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className={styles.userCell}>
                              <img src={ROW_AVATAR} alt="" className={styles.rowAvatar} width={40} height={40} />
                              <span className={styles.userCellName}>{user.name}</span>
                            </div>
                          </td>
                          <td className={styles.emailCell}>{user.email}</td>
                          <td>
                            <RoleBadge role={user.role} />
                          </td>
                          <td>
                            <StatusBadge status={user.status} />
                          </td>
                          <td className={styles.dateCell}>{user.registeredAt}</td>
                          <td className={styles.dateCell}>{user.lastLoginAt}</td>
                          <td>
                            <RowActions
                              open={openMenuId === user.id}
                              onToggle={() => toggleMenu(user.id)}
                              onEdit={() => openEdit(user)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              </section>

              <section className={styles.mobileList}>
                {pageItems.map((user) => (
                  <UserMobileCard
                    key={user.id}
                    user={user}
                    menuOpen={openMenuId === user.id}
                    onToggleMenu={() => toggleMenu(user.id)}
                    onEdit={() => openEdit(user)}
                  />
                ))}
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              </section>
            </>
          )}
        </div>
      </div>
      <MobileBottomNav />
      {editingUser ? (
        <AccountFormModal
          mode="edit"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleSaveUser}
        />
      ) : null}
      {createOpen ? (
        <AccountFormModal mode="create" onClose={() => setCreateOpen(false)} onSubmit={handleCreateUser} />
      ) : null}
      {createdAccount ? (
        <AccountCreatedModal
          account={createdAccount}
          onClose={() => setCreatedAccount(null)}
          onCreateAnother={() => {
            setCreatedAccount(null);
            setCreateOpen(true);
          }}
        />
      ) : null}
    </div>
  );
}
