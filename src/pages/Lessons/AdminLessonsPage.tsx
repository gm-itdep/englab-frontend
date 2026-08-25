import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import styles from './AdminLessonsPage.module.css';

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
import ICON_PAGE_DOTS from '../../assets/icons/admin/users/arrow-page.svg';
import ICON_RETURN from '../../assets/icons/admin/lessons/return.svg';
import ICON_EMPTY_LESSONS from '../../assets/icons/admin/empty-lessons.svg';
import ROW_AVATAR from '../../assets/images/admin/users/row-avatar.png';

import {
  applyPeriodFilter,
  getAdminLessons,
  lessonMatchesSearch,
  PAGE_SIZE,
  PERIOD_FILTER_ALL,
  PERIOD_FILTER_OPTIONS,
  STATUS_FILTER_ALL,
  STATUS_FILTER_OPTIONS,
  STATUS_LABELS,
  statusMatchesFilter,
  type AdminLesson,
  type LessonStatus,
} from './lessonsData';

const ADMIN_NAME = 'Пётр Васильев';

type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number];
type PeriodFilter = (typeof PERIOD_FILTER_OPTIONS)[number];

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

function StatusBadge({ status }: { status: LessonStatus }) {
  const tone =
    status === 'scheduled'
      ? styles.badgeScheduled
      : status === 'completed'
        ? styles.badgeCompleted
        : status === 'cancelled'
          ? styles.badgeCancelled
          : styles.badgeNoShow;

  return <span className={[styles.badge, tone].join(' ')}>{STATUS_LABELS[status]}</span>;
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  ariaLabel,
  defaultValue,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  ariaLabel: string;
  defaultValue: T;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const filled = value !== defaultValue;

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
          className={[
            styles.select,
            open ? styles.selectOpen : '',
            filled ? styles.selectFilled : '',
          ]
            .filter(Boolean)
            .join(' ')}
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

function PersonCell({ name, email }: { name: string; email: string }) {
  return (
    <div className={styles.personCell}>
      <img src={ROW_AVATAR} alt="" className={styles.rowAvatar} width={40} height={40} />
      <div className={styles.personIdentity}>
        <span className={styles.personName}>{name}</span>
        <span className={styles.personEmail}>{email}</span>
      </div>
    </div>
  );
}

function CancelButton({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={[styles.cancelButton, !enabled ? styles.cancelButtonDisabled : ''].filter(Boolean).join(' ')}
      disabled={!enabled}
      onClick={onClick}
    >
      Отменить
    </button>
  );
}

function LessonMobileCard({
  lesson,
  onCancel,
}: {
  lesson: AdminLesson;
  onCancel: () => void;
}) {
  return (
    <article className={styles.lessonCard}>
      <div className={styles.lessonCardTop}>
        <div className={styles.lessonCardProfile}>
          <img src={ROW_AVATAR} alt="" className={styles.lessonCardAvatar} width={40} height={40} />
          <div className={styles.lessonCardNames}>
            <span className={styles.lessonCardStudent}>{lesson.studentName}</span>
            <span className={styles.lessonCardTeacher}>{lesson.teacherName}</span>
          </div>
        </div>
        <StatusBadge status={lesson.status} />
      </div>
      <div className={styles.lessonCardBottom}>
        <div className={styles.lessonCardDate}>
          <span>{lesson.date}</span>
          <span className={styles.lessonCardTime}>{lesson.time}</span>
        </div>
        <CancelButton enabled={lesson.status === 'scheduled'} onClick={onCancel} />
      </div>
    </article>
  );
}

function LessonsEmptyState() {
  return (
    <section className={styles.emptyCard} aria-label="Уроки не найдены">
      <div className={styles.emptyContent}>
        <div className={styles.emptyIcon}>
          <img src={ICON_EMPTY_LESSONS} alt="" width={70} height={70} />
        </div>
        <div className={styles.emptyText}>
          <p className={styles.emptyTitle}>Уроки не найдены</p>
          <p className={styles.emptyDesc}>
            По выбранным фильтрам нет занятий. Измените параметры поиска или сбросьте фильтры.
          </p>
        </div>
      </div>
    </section>
  );
}

function MobileBottomNav() {
  const items: Array<{ icon: string; label: string; to?: string; active: boolean }> = [
    { icon: MOBILE_ICON_HOME, label: 'Главная', to: '/home', active: false },
    { icon: MOBILE_ICON_USERS, label: 'Пользователи', to: '/users', active: false },
    { icon: MOBILE_ICON_LESSONS, label: 'Уроки', to: '/lessons', active: true },
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

export function AdminLessonsPage() {
  const session = getSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(STATUS_FILTER_ALL);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>(PERIOD_FILTER_ALL);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [lessons, setLessons] = useState(() => getAdminLessons());
  const forceEmpty = searchParams.get('empty') === '1';

  const filtered = useMemo(() => {
    if (forceEmpty) return [];
    const query = search.trim().toLowerCase();
    const byStatusAndSearch = lessons.filter((lesson) => {
      if (!statusMatchesFilter(lesson.status, statusFilter)) return false;
      if (!lessonMatchesSearch(lesson, query)) return false;
      return true;
    });
    return applyPeriodFilter(byStatusAndSearch, periodFilter);
  }, [lessons, search, statusFilter, periodFilter, forceEmpty]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const showEmpty = filtered.length === 0;

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, periodFilter]);

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

  const resetFilters = () => {
    setSearch('');
    setStatusFilter(STATUS_FILTER_ALL);
    setPeriodFilter(PERIOD_FILTER_ALL);
    setFiltersOpen(false);
  };

  const handleCancel = (id: string) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id && lesson.status === 'scheduled' ? { ...lesson, status: 'cancelled' } : lesson,
      ),
    );
  };

  const hasActiveFilters =
    search.trim().length > 0 || statusFilter !== STATUS_FILTER_ALL || periodFilter !== PERIOD_FILTER_ALL;

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
              <SidebarItem icon={ICON_LESSONS} label="Уроки" to="/lessons" active />
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
              <h1 className={styles.pageTitle}>Уроки</h1>
              <p className={styles.pageSubtitle}>Все занятия платформы</p>
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
                  <img src={ICON_CHEVRON} alt="" width={8.994} height={5.209} />
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
                  placeholder="Поиск по студенту или преподавателю"
                  aria-label="Поиск по студенту или преподавателю"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className={styles.toolbarDesktopExtras}>
                <FilterSelect
                  label="Статус"
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={setStatusFilter}
                  ariaLabel="Статус"
                  defaultValue={STATUS_FILTER_ALL}
                />
                <FilterSelect
                  label="Период"
                  value={periodFilter}
                  options={PERIOD_FILTER_OPTIONS}
                  onChange={setPeriodFilter}
                  ariaLabel="Период"
                  defaultValue={PERIOD_FILTER_ALL}
                />
              </div>
            </div>
            <button type="button" className={styles.resetToolbarButton} onClick={resetFilters}>
              <img src={ICON_RETURN} alt="" width={16} height={16} />
              Сбросить фильтры
            </button>
            <button
              type="button"
              className={[styles.filterButton, filtersOpen ? styles.filterButtonActive : '']
                .filter(Boolean)
                .join(' ')}
              aria-label="Фильтры"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((prev) => !prev)}
            >
              <img src={ICON_FILTER} alt="" width={24} height={23} />
            </button>
            {filtersOpen ? (
              <div className={styles.mobileFilters}>
                <FilterSelect
                  label="Статус"
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={setStatusFilter}
                  ariaLabel="Статус"
                  defaultValue={STATUS_FILTER_ALL}
                />
                <FilterSelect
                  label="Период"
                  value={periodFilter}
                  options={PERIOD_FILTER_OPTIONS}
                  onChange={setPeriodFilter}
                  ariaLabel="Период"
                  defaultValue={PERIOD_FILTER_ALL}
                />
              </div>
            ) : null}
          </section>

          {hasActiveFilters && !showEmpty ? (
            <div className={styles.foundRow} aria-live="polite">
              <span className={styles.foundLabel}>Найдено:</span>
              <span className={styles.foundCount}>{filtered.length}</span>
            </div>
          ) : null}

          {showEmpty ? (
            <LessonsEmptyState />
          ) : (
            <>
              <section className={styles.tableCard}>
                <div className={styles.tableScroll}>
                  <table className={styles.lessonsTable}>
                    <thead>
                      <tr>
                        <th>Студент</th>
                        <th>Преподаватель</th>
                        <th>Дата</th>
                        <th>Статус</th>
                        <th>Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((lesson) => (
                        <tr key={lesson.id}>
                          <td>
                            <PersonCell name={lesson.studentName} email={lesson.studentEmail} />
                          </td>
                          <td>
                            <PersonCell name={lesson.teacherName} email={lesson.teacherEmail} />
                          </td>
                          <td>
                            <div className={styles.dateTimeCell}>
                              <span>{lesson.date}</span>
                              <span>{lesson.time}</span>
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={lesson.status} />
                          </td>
                          <td>
                            <div className={styles.actionsCell}>
                              <CancelButton
                                enabled={lesson.status === 'scheduled'}
                                onClick={() => handleCancel(lesson.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              </section>

              <section className={styles.mobileList}>
                {pageItems.map((lesson) => (
                  <LessonMobileCard key={lesson.id} lesson={lesson} onCancel={() => handleCancel(lesson.id)} />
                ))}
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              </section>
            </>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
