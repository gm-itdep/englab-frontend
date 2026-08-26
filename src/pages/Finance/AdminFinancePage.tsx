import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import styles from './AdminFinancePage.module.css';

import LOGO_COMPACT from '../../assets/icons/admin/05f06da7-da57-4718-bf22-90a176ac3523.svg';
import LOGO_FULL from '../../assets/icons/admin/326a0b15-9c90-411c-8b53-3c1d538d3da9.svg';
import ICON_HOME from '../../assets/icons/admin/734d5e33-5e2d-4a6a-a1ea-a956aed5984d.svg';
import ICON_USERS from '../../assets/icons/admin/ddbf7ea0-8bd0-4175-88a3-d7706f401df7.svg';
import ICON_LESSONS from '../../assets/icons/admin/350ef0ca-32e0-46cf-bc47-2f1b28d93ade.svg';
import ICON_FINANCE from '../../assets/icons/admin/6d1ac038-b3de-4db1-abcf-da4ccd1fa4b7.svg';
import ICON_EXIT from '../../assets/icons/admin/0156cecf-0b9d-448b-8e1e-62c6859c6fc3.svg';
import ICON_NOTIFICATION from '../../assets/icons/admin/40f79c9c-cae5-474f-931e-464f5a9dae78.svg';
import ICON_CHEVRON from '../../assets/icons/admin/dbe9bd54-fd9c-4a89-a289-98950ea9cffa.svg';
import ICON_EMPTY_WALLET from '../../assets/icons/admin/empty-wallet.svg';
import AVATAR from '../../assets/images/admin/da13fe3f-3c26-4838-9f87-50e819b11e60.png';
import MOBILE_AVATAR from '../../assets/images/admin/abfd45ff-f19a-4cda-b003-ba4e8f05fe56.png';
import MOBILE_ICON_HOME from '../../assets/icons/admin/c87f92f3-d0a2-417b-bc56-7fe57c84693a.svg';
import MOBILE_ICON_USERS from '../../assets/icons/admin/11d24a82-2cc3-49e3-a1d9-bbb46beda238.svg';
import MOBILE_ICON_LESSONS from '../../assets/icons/admin/e9c6ab6f-81c4-4be0-ac22-90f0382426a1.svg';
import MOBILE_ICON_FINANCE from '../../assets/icons/admin/47ab14b6-6f95-4839-8c25-b62c1aa4d669.svg';
import ICON_FILTER from '../../assets/icons/admin/users/filter.svg';
import ICON_ARROW_LITE from '../../assets/icons/admin/users/arrow-lite.svg';
import ICON_PAGE_DOTS from '../../assets/icons/admin/users/arrow-page.svg';
import ICON_MODAL_CLOSE from '../../assets/icons/admin/users/close.svg';
import ICON_CHECK_MARK from '../../assets/icons/admin/users/check-mark.svg';
import ROW_AVATAR from '../../assets/images/admin/users/row-avatar.png';
import { TextField } from '../../components/ui';

import {
  getFinanceTransactions,
  PAGE_SIZE,
  PERIOD_FILTER_ALL,
  PERIOD_FILTER_OPTIONS,
  TYPE_FILTER_ALL,
  TYPE_FILTER_OPTIONS,
  TYPE_LABELS,
  typeMatchesFilter,
  type FinanceTransaction,
  type FinanceTxType,
} from './financeData';

const ADMIN_NAME = 'Пётр Васильев';

const STUDENT_OPTIONS = [
  'Иван Васильев',
  'Анна Смирнова',
  'Пётр Козлов',
  'Мария Иванова',
  'Алексей Новиков',
] as const;

const STUDENT_PLACEHOLDER = 'Выберите студента';

type TypeFilter = (typeof TYPE_FILTER_OPTIONS)[number];
type PeriodFilter = (typeof PERIOD_FILTER_OPTIONS)[number];
type StudentOption = (typeof STUDENT_OPTIONS)[number] | '';

type AccrueResult = {
  student: string;
  credits: string;
  reason: string;
};

function formatCreditsLabel(value: string): string {
  const trimmed = value.trim();
  if (/кредит/i.test(trimmed)) return trimmed;
  return `${trimmed} кредитов`;
}

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

function TypeBadge({ type }: { type: FinanceTxType }) {
  const tone =
    type === 'lesson_debit'
      ? styles.badgeLesson
      : type === 'topup'
        ? styles.badgeTopup
        : type === 'refund'
          ? styles.badgeRefund
          : styles.badgeCredit;

  return <span className={[styles.badge, tone].join(' ')}>{TYPE_LABELS[type]}</span>;
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  ariaLabel,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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
    <div className={styles.filterField} ref={rootRef}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.selectWrap}>
        <button
          type="button"
          className={[styles.select, open ? styles.selectOpen : ''].filter(Boolean).join(' ')}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={ariaLabel}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{value}</span>
          <span className={[styles.selectIcon, open ? styles.selectIconOpen : ''].filter(Boolean).join(' ')}>
            <img src={ICON_ARROW_LITE} alt="" width={14} height={14} />
          </span>
        </button>
        {open ? (
          <ul id={listId} className={styles.selectDropdown} role="listbox" aria-label={ariaLabel}>
            {options.map((option) => {
              const selected = option === value;
              return (
                <li key={option} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={[styles.selectOption, selected ? styles.selectOptionSelected : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
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
    { icon: MOBILE_ICON_USERS, label: 'Пользователи', to: '/users', active: false },
    { icon: MOBILE_ICON_LESSONS, label: 'Уроки', to: '/lessons', active: false },
    { icon: MOBILE_ICON_FINANCE, label: 'Финансы', to: '/finance', active: true },
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

function FinanceMobileCard({ tx }: { tx: FinanceTransaction }) {
  return (
    <article className={styles.financeCard}>
      <div className={styles.financeCardTop}>
        <div className={styles.financeCardProfile}>
          <img src={ROW_AVATAR} alt="" className={styles.financeCardAvatar} width={40} height={40} />
          <div className={styles.financeCardIdentity}>
            <p className={styles.financeCardName}>{tx.studentName}</p>
            <TypeBadge type={tx.type} />
          </div>
        </div>
        <div className={styles.financeCardDate}>
          <span>{tx.date}</span>
          <span>{tx.time}</span>
        </div>
      </div>
      <div className={styles.financeCardMeta}>
        <div className={styles.financeCardMetaItem}>
          <span className={styles.financeCardMetaLabel}>Кредиты</span>
          <span className={styles.financeCardCredits}>{tx.creditsLabel}</span>
        </div>
        <div className={styles.financeCardMetaAmount}>
          <span className={styles.financeCardMetaLabel}>Сумма</span>
          <span className={styles.financeCardAmount}>{tx.amountLabel}</span>
        </div>
      </div>
    </article>
  );
}

function SkeletonBar({ className }: { className: string }) {
  return <span className={[styles.skeletonBar, className].join(' ')} aria-hidden />;
}

function FinanceLoadingTable() {
  return (
    <section className={styles.tableCard} aria-busy="true" aria-label="Загрузка транзакций">
      <div className={styles.tableScroll}>
        <table className={styles.financeTable}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Студент</th>
              <th>Тип</th>
              <th className={styles.thCenter}>Кредиты</th>
              <th className={styles.thCenter}>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <tr key={`loading-row-${index}`}>
                <td>
                  <div className={styles.dateTimeCell}>
                    <SkeletonBar className={styles.skeletonDate} />
                    <SkeletonBar className={styles.skeletonDate} />
                  </div>
                </td>
                <td>
                  <div className={styles.userCell}>
                    <span className={styles.skeletonAvatar} aria-hidden />
                    <SkeletonBar className={styles.skeletonName} />
                  </div>
                </td>
                <td>
                  <SkeletonBar className={styles.skeletonType} />
                </td>
                <td className={styles.thCenter}>
                  <SkeletonBar className={styles.skeletonCredits} />
                </td>
                <td className={styles.thCenter}>
                  <SkeletonBar className={styles.skeletonAmount} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className={styles.pagination} aria-hidden>
        <span className={styles.pageArrow} />
        <span className={styles.pageBtnSkeleton} />
        <span className={styles.pageBtnSkeleton} />
        <span className={styles.pageBtnSkeleton} />
        <span className={styles.pageEllipsis}>
          <img src={ICON_PAGE_DOTS} alt="" width={22.4} height={3.2} />
        </span>
        <span className={styles.pageArrow} />
      </nav>
    </section>
  );
}

function FinanceLoadingMobileCard() {
  return (
    <article className={styles.financeCard} aria-hidden>
      <div className={styles.financeCardTop}>
        <div className={styles.financeCardProfile}>
          <span className={styles.skeletonAvatar} />
          <div className={styles.financeCardIdentity}>
            <SkeletonBar className={styles.skeletonMobileName} />
            <SkeletonBar className={styles.skeletonMobileBadge} />
          </div>
        </div>
        <div className={styles.financeCardDate}>
          <SkeletonBar className={styles.skeletonMobileDate} />
          <SkeletonBar className={styles.skeletonMobileTime} />
        </div>
      </div>
      <div className={styles.financeCardMeta}>
        <div className={styles.financeCardMetaItem}>
          <SkeletonBar className={styles.skeletonMobileMetaLabel} />
          <SkeletonBar className={styles.skeletonMobileMetaValue} />
        </div>
        <div className={styles.financeCardMetaAmount}>
          <SkeletonBar className={styles.skeletonMobileMetaLabel} />
          <SkeletonBar className={styles.skeletonMobileMetaValue} />
        </div>
      </div>
    </article>
  );
}

function FinanceEmptyState() {
  return (
    <section className={styles.emptyCard} aria-label="Пустой список транзакций">
      <div className={styles.emptyContent}>
        <div className={styles.emptyIcon}>
          <img src={ICON_EMPTY_WALLET} alt="" width={70} height={70} />
        </div>
        <div className={styles.emptyText}>
          <p className={styles.emptyTitle}>Транзакций пока нет</p>
          <p className={styles.emptyDesc}>
            Здесь появятся платежи и начисления кредитов по мере их совершения.
          </p>
        </div>
      </div>
    </section>
  );
}

function AccrueCreditsModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (result: AccrueResult) => void;
}) {
  const titleId = useId();
  const studentId = useId();
  const creditsId = useId();
  const reasonId = useId();
  const studentListId = useId();
  const studentRef = useRef<HTMLDivElement>(null);
  const [student, setStudent] = useState<StudentOption>('');
  const [credits, setCredits] = useState('');
  const [reason, setReason] = useState('');
  const [studentError, setStudentError] = useState('');
  const [creditsError, setCreditsError] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [studentOpen, setStudentOpen] = useState(false);

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

  useEffect(() => {
    if (!studentOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!studentRef.current?.contains(event.target as Node)) setStudentOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [studentOpen]);

  const handleSubmit = () => {
    const nextStudentError = student ? '' : 'Выберите студента';
    const nextCreditsError = credits.trim() ? '' : 'Введите количество кредитов';
    const nextReasonError = reason.trim() ? '' : 'Укажите причину начисления';
    setStudentError(nextStudentError);
    setCreditsError(nextCreditsError);
    setReasonError(nextReasonError);
    if (nextStudentError || nextCreditsError || nextReasonError) return;
    onSuccess({
      student,
      credits: credits.trim(),
      reason: reason.trim(),
    });
  };

  return (
    <div
      className={[styles.editOverlay, styles.creditOverlay].join(' ')}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={[styles.editModal, styles.creditModal].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.editModalBody}>
          <div className={styles.creditModalHeader}>
            <button type="button" className={styles.editModalClose} aria-label="Закрыть" onClick={onClose}>
              <img src={ICON_MODAL_CLOSE} alt="" width={16.8} height={16.8} />
            </button>
            <h2 id={titleId} className={styles.creditModalTitle}>
              Начислить кредиты
            </h2>
          </div>
          <div className={styles.editModalFields}>
            <div className={styles.creditField}>
              <label className={styles.creditFieldLabel} htmlFor={studentId}>
                Студент
              </label>
              <div className={styles.creditSelectControl} ref={studentRef}>
                <button
                  type="button"
                  id={studentId}
                  className={[
                    styles.select,
                    styles.creditSelect,
                    studentOpen ? styles.selectOpen : '',
                    studentError ? styles.selectError : '',
                    !student ? styles.creditSelectPlaceholder : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-haspopup="listbox"
                  aria-expanded={studentOpen}
                  aria-controls={studentListId}
                  aria-invalid={studentError ? true : undefined}
                  aria-describedby={studentError ? `${studentId}-error` : undefined}
                  onClick={() => setStudentOpen((prev) => !prev)}
                >
                  <span>{student || STUDENT_PLACEHOLDER}</span>
                  <span
                    className={[styles.selectIcon, studentOpen ? styles.selectIconOpen : '']
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <img src={ICON_ARROW_LITE} alt="" width={14} height={14} />
                  </span>
                </button>
                {studentOpen ? (
                  <ul
                    id={studentListId}
                    className={styles.selectDropdown}
                    role="listbox"
                    aria-label="Студент"
                  >
                    {STUDENT_OPTIONS.map((option) => {
                      const selected = option === student;
                      return (
                        <li key={option} role="presentation">
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            className={[
                              styles.selectOption,
                              selected ? styles.selectOptionSelected : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            onClick={() => {
                              setStudent(option);
                              setStudentError('');
                              setStudentOpen(false);
                            }}
                          >
                            {option}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {studentError ? (
                  <p id={`${studentId}-error`} className={styles.creditFieldError} role="alert">
                    {studentError}
                  </p>
                ) : null}
              </div>
            </div>
            <TextField
              id={creditsId}
              label="Количество кредитов"
              placeholder="Например, 10"
              inputMode="numeric"
              value={credits}
              errorMessage={creditsError || undefined}
              onChange={(event) => {
                setCredits(event.target.value);
                if (creditsError) setCreditsError('');
              }}
            />
            <TextField
              id={reasonId}
              label="Причина"
              placeholder="Укажите причину начисления"
              value={reason}
              errorMessage={reasonError || undefined}
              onChange={(event) => {
                setReason(event.target.value);
                if (reasonError) setReasonError('');
              }}
            />
          </div>
        </div>
        <div className={[styles.editModalActions, styles.creditModalActions].join(' ')}>
          <button type="button" className={styles.editCancelButton} onClick={onClose}>
            Отмена
          </button>
          <button type="button" className={styles.editSaveButton} onClick={handleSubmit}>
            Начислить
          </button>
        </div>
      </div>
    </div>
  );
}

function AccrueCreditsSuccessModal({
  result,
  onClose,
}: {
  result: AccrueResult;
  onClose: () => void;
}) {
  const titleId = useId();

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
      className={[styles.editOverlay, styles.creditOverlay].join(' ')}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={[styles.createdModal, styles.creditSuccessModal].join(' ')}
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
              Кредиты начислены
            </p>
            <p className={styles.createdDesc}>
              Начисление кредита сохранено. Баланс студента обновлён.
            </p>
          </div>
        </div>
        <div className={styles.createdDetails}>
          <div className={styles.createdDetailRow}>
            <span className={styles.createdDetailLabel}>Студент</span>
            <span className={styles.createdDetailValue}>{result.student}</span>
          </div>
          <div className={styles.createdDetailRow}>
            <span className={styles.createdDetailLabel}>Количество кредитов</span>
            <span className={styles.createdDetailValue}>{formatCreditsLabel(result.credits)}</span>
          </div>
          <div className={styles.createdDetailRow}>
            <span className={styles.createdDetailLabel}>Причина</span>
            <span className={styles.createdDetailValue}>{result.reason}</span>
          </div>
        </div>
        <div className={styles.creditSuccessActions}>
          <button type="button" className={styles.editSaveButton} onClick={onClose}>
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminFinancePage() {
  const session = getSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoading = searchParams.get('loading') === '1';
  const isEmpty = !isLoading && searchParams.get('empty') === '1';
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(TYPE_FILTER_ALL);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>(PERIOD_FILTER_ALL);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [accrueOpen, setAccrueOpen] = useState(false);
  const [accrueResult, setAccrueResult] = useState<AccrueResult | null>(null);
  const transactions = useMemo(() => (isEmpty ? [] : getFinanceTransactions()), [isEmpty]);

  const filtered = useMemo(
    () => transactions.filter((tx) => typeMatchesFilter(tx.type, typeFilter)),
    [transactions, typeFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const showEmpty = !isLoading && (isEmpty || filtered.length === 0);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, periodFilter]);

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
              <SidebarItem icon={ICON_USERS} label="Пользователи" to="/users" />
              <SidebarItem icon={ICON_LESSONS} label="Уроки" to="/lessons" />
              <SidebarItem icon={ICON_FINANCE} label="Финансы" to="/finance" active />
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
              <h1 className={styles.pageTitle}>Финансы</h1>
              <p className={styles.pageSubtitle}>Транзакции и начисления кредитов</p>
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
              <div className={styles.toolbarDesktopExtras}>
                <FilterSelect
                  label="Тип"
                  value={typeFilter}
                  options={TYPE_FILTER_OPTIONS}
                  onChange={setTypeFilter}
                  ariaLabel="Тип транзакции"
                />
                <FilterSelect
                  label="Период"
                  value={periodFilter}
                  options={PERIOD_FILTER_OPTIONS}
                  onChange={setPeriodFilter}
                  ariaLabel="Период"
                />
              </div>
            </div>
            <button
              type="button"
              className={[styles.createButton, isLoading ? styles.createButtonDisabled : '']
                .filter(Boolean)
                .join(' ')}
              disabled={isLoading}
              onClick={() => setAccrueOpen(true)}
            >
              Начислить кредиты
            </button>
            <button
              type="button"
              className={[styles.filterButton, filtersOpen ? styles.filterButtonActive : '']
                .filter(Boolean)
                .join(' ')}
              aria-label="Фильтры"
              aria-expanded={filtersOpen}
              disabled={isLoading}
              onClick={() => setFiltersOpen((prev) => !prev)}
            >
              <img src={ICON_FILTER} alt="" width={24} height={23} />
            </button>
            {filtersOpen ? (
              <div className={styles.mobileFilters}>
                <FilterSelect
                  label="Тип"
                  value={typeFilter}
                  options={TYPE_FILTER_OPTIONS}
                  onChange={setTypeFilter}
                  ariaLabel="Тип транзакции"
                />
                <FilterSelect
                  label="Период"
                  value={periodFilter}
                  options={PERIOD_FILTER_OPTIONS}
                  onChange={setPeriodFilter}
                  ariaLabel="Период"
                />
              </div>
            ) : null}
          </section>

          {isLoading ? (
            <>
              <FinanceLoadingTable />
              <section className={styles.mobileList} aria-busy="true" aria-label="Загрузка транзакций">
                {Array.from({ length: 5 }, (_, index) => (
                  <FinanceLoadingMobileCard key={`loading-card-${index}`} />
                ))}
              </section>
            </>
          ) : showEmpty ? (
            <FinanceEmptyState />
          ) : (
            <>
              <section className={styles.tableCard}>
                <div className={styles.tableScroll}>
                  <table className={styles.financeTable}>
                    <thead>
                      <tr>
                        <th>Дата</th>
                        <th>Студент</th>
                        <th>Тип</th>
                        <th className={styles.thCenter}>Кредиты</th>
                        <th className={styles.thCenter}>Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            <div className={styles.dateTimeCell}>
                              <span>{tx.date}</span>
                              <span>{tx.time}</span>
                            </div>
                          </td>
                          <td>
                            <div className={styles.userCell}>
                              <img src={ROW_AVATAR} alt="" className={styles.rowAvatar} width={40} height={40} />
                              <span className={styles.studentName}>{tx.studentName}</span>
                            </div>
                          </td>
                          <td>
                            <TypeBadge type={tx.type} />
                          </td>
                          <td className={styles.thCenter}>
                            <span className={styles.creditsCell}>{tx.creditsLabel}</span>
                          </td>
                          <td className={styles.thCenter}>
                            <span className={styles.amountCell}>{tx.amountLabel}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              </section>

              <section className={styles.mobileList}>
                {pageItems.map((tx) => (
                  <FinanceMobileCard key={tx.id} tx={tx} />
                ))}
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              </section>
            </>
          )}
        </div>
      </div>
      <MobileBottomNav />
      {accrueOpen ? (
        <AccrueCreditsModal
          onClose={() => setAccrueOpen(false)}
          onSuccess={(result) => {
            setAccrueOpen(false);
            setAccrueResult(result);
          }}
        />
      ) : null}
      {accrueResult ? (
        <AccrueCreditsSuccessModal result={accrueResult} onClose={() => setAccrueResult(null)} />
      ) : null}
    </div>
  );
}
