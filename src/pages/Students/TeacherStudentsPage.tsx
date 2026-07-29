import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import { t } from '../../shared/i18n';
import iconLogoMark from '../../assets/icons/teacher/logo-mark.svg';
import iconHome from '../../assets/icons/teacher/home.svg';
import iconCalendar from '../../assets/icons/teacher/calendar.svg';
import iconBook from '../../assets/icons/teacher/book.svg';
import iconStudents from '../../assets/icons/teacher/students.svg';
import iconExit from '../../assets/icons/teacher/exit.svg';
import iconNotification from '../../assets/icons/teacher/notification.svg';
import iconChevron from '../../assets/icons/teacher/chevron.svg';
import iconSearch from '../../assets/icons/teacher/search.svg';
import iconReset from '../../assets/icons/teacher/reset-filters.svg';
import iconResetActive from '../../assets/icons/teacher/reset-filters-active.svg';
import iconArrowLite from '../../assets/icons/teacher/arrow-lite.svg';
import iconSlot from '../../assets/icons/teacher/slot.svg';
import iconBookSm from '../../assets/icons/teacher/book-sm.svg';
import iconPencilNav from '../../assets/icons/teacher/pencil-nav.svg';
import iconDots from '../../assets/icons/teacher/dots.svg';
import iconFilterSliders from '../../assets/icons/teacher/filter-sliders.svg';
import iconEmptyStudents from '../../assets/icons/teacher/empty-students.svg';
import imgAvatarTeacher from '../../assets/images/teacher/avatar-teacher.png';
import imgAvatarMobile from '../../assets/images/teacher/avatar-mobile.png';
import logoEnglab from '../../assets/images/logo-englab.svg';
import styles from './TeacherStudentsPage.module.css';
import {
  LEVEL_ALL,
  LEVEL_OPTIONS,
  PAGE_SIZE,
  UPCOMING_ALL,
  UPCOMING_OPTIONS,
  getStudents,
  type StudentCard,
} from './studentsData';

const th = t.teacherHome;
const ts = t.teacherStudents;

type FilterKey = 'level' | 'upcoming';

type FilterValues = {
  search: string;
  level: string;
  upcoming: string;
};

const DEFAULT_FILTERS: FilterValues = {
  search: '',
  level: '',
  upcoming: '',
};

const MOBILE_FILTER_ITEMS: {
  key: FilterKey;
  label: string;
  options: readonly string[];
}[] = [
  { key: 'level', label: ts.levelLabel, options: LEVEL_OPTIONS },
  {
    key: 'upcoming',
    label: ts.upcomingLabel,
    options: UPCOMING_OPTIONS.map((option) => option.label),
  },
];

function displayFilterValue(value: string, allValue: string) {
  return !value || value === allValue ? '' : value;
}

function isFilterSelected(value: string, option: string, allValue: string) {
  if (!value || value === allValue) return option === allValue;
  return value === option;
}

function IconImg({
  src,
  size = 24,
  box,
}: {
  src: string;
  size?: number;
  box?: number;
}) {
  const boxSize = box ?? size;
  return (
    <span className={styles.iconBox} style={{ width: boxSize, height: boxSize }}>
      <img src={src} alt="" width={size} height={size} style={{ width: size, height: size }} />
    </span>
  );
}

function Sidebar({
  expanded,
  onToggle,
  onLogout,
}: {
  expanded: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  const topItems = [
    { icon: iconHome, iconSize: 28, label: th.navHome, to: '/home', active: false },
    { icon: iconCalendar, iconSize: 22.4, label: th.navCalendar, to: '/schedule', active: false },
    { icon: iconBook, iconSize: 22.4, label: th.navBook, to: '/lesson', active: false },
    { icon: iconStudents, iconSize: 22.4, label: th.navStudents, to: '/students', active: true },
  ] as const;

  const bottomItems = [
    { icon: iconNotification, iconSize: 22.4, label: th.notifications, onClick: undefined },
    { icon: iconExit, iconSize: 22.4, label: th.logout, onClick: onLogout },
  ] as const;

  return (
    <aside
      className={[styles.sidebar, expanded ? styles.sidebarExpanded : ''].filter(Boolean).join(' ')}
      aria-label="Навигация"
    >
      <button
        type="button"
        className={styles.logoMark}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={expanded ? th.navCollapse : th.navExpand}
      >
        {expanded ? (
          <img src={logoEnglab} alt={t.common.brand} className={styles.logoFull} width={110} height={27} />
        ) : (
          <img src={iconLogoMark} alt={t.common.brand} className={styles.logoCompact} width={38} height={26} />
        )}
      </button>
      <div className={styles.sidebarMenu}>
        <nav className={styles.sidebarNav}>
          {topItems.map((item) => {
            const className = [styles.navBtn, item.active ? styles.navBtnActive : '']
              .filter(Boolean)
              .join(' ');
            const content = (
              <>
                <IconImg src={item.icon} box={32} size={item.iconSize} />
                {expanded ? <span className={styles.navLabel}>{item.label}</span> : null}
              </>
            );
            return (
              <Link
                key={item.label}
                to={item.to}
                className={className}
                aria-current={item.active ? 'page' : undefined}
                aria-label={item.label}
              >
                {content}
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarBottom}>
          {bottomItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={styles.navBtn}
              aria-label={item.label}
              onClick={item.onClick}
            >
              <IconImg src={item.icon} box={32} size={item.iconSize} />
              {expanded ? <span className={styles.navLabel}>{item.label}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarTitles}>
        <h1 className={styles.title}>{ts.title}</h1>
        <p className={styles.subtitle}>{ts.subtitle}</p>
      </div>
      <div className={styles.topbarActions}>
        <button type="button" className={styles.iconButton} aria-label={th.notifications}>
          <IconImg src={iconNotification} box={32} size={22.4} />
        </button>
        <button type="button" className={styles.userChip}>
          <span className={styles.userChipProfile}>
            <img src={imgAvatarTeacher} alt="" className={styles.userAvatar} width={32} height={32} />
            <span className={styles.userName}>{th.teacherName}</span>
          </span>
          <span className={styles.userChevron}>
            <img src={iconChevron} alt="" width={9} height={5} />
          </span>
        </button>
        <button type="button" className={styles.mobileAvatarBtn} aria-label={th.teacherName}>
          <img src={imgAvatarMobile} alt="" width={32} height={32} />
        </button>
      </div>
    </header>
  );
}

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  allValue,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  allValue: string;
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  const display = displayFilterValue(value, allValue);

  return (
    <div className={styles.filterField}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.filterSelectWrap}>
        <button
          type="button"
          className={[styles.filterSelect, open ? styles.filterSelectOpen : ''].filter(Boolean).join(' ')}
          aria-expanded={open}
          onClick={onToggle}
        >
          <span className={!display ? styles.filterPlaceholder : undefined}>
            {display || placeholder}
          </span>
          <span className={[styles.filterChevron, open ? styles.filterChevronOpen : ''].filter(Boolean).join(' ')}>
            <img src={iconChevron} alt="" width={9} height={5} />
          </span>
        </button>
        {open ? (
          <ul className={styles.filterDropdown} role="listbox">
            {options.map((option) => {
              const selected = isFilterSelected(value, option, allValue);
              return (
                <li key={option}>
                  <button
                    type="button"
                    className={[styles.filterOption, selected ? styles.filterOptionSelected : '']
                      .filter(Boolean)
                      .join(' ')}
                    role="option"
                    aria-selected={selected}
                    onClick={() => onChange(option === allValue ? '' : option)}
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

function UpcomingFilterSelect({
  label,
  placeholder,
  value,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  const display = displayFilterValue(value, UPCOMING_ALL);
  const selectedOption = UPCOMING_OPTIONS.find((option) => option.label === value);
  const selectedHint = selectedOption && 'hint' in selectedOption ? selectedOption.hint : undefined;
  const triggerLabel = selectedOption
    ? selectedHint
      ? `${selectedOption.label} ${selectedHint}`
      : selectedOption.label
    : '';

  return (
    <div className={styles.filterField}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.filterSelectWrap}>
        <button
          type="button"
          className={[styles.filterSelect, open ? styles.filterSelectOpen : ''].filter(Boolean).join(' ')}
          aria-expanded={open}
          onClick={onToggle}
        >
          <span className={!display ? styles.filterPlaceholder : undefined}>
            {display ? triggerLabel : placeholder}
          </span>
          <span className={[styles.filterChevron, open ? styles.filterChevronOpen : ''].filter(Boolean).join(' ')}>
            <img src={iconChevron} alt="" width={9} height={5} />
          </span>
        </button>
        {open ? (
          <ul className={styles.filterDropdown} role="listbox">
            {UPCOMING_OPTIONS.map((option) => {
              const selected = isFilterSelected(value, option.label, UPCOMING_ALL);
              return (
                <li key={option.label}>
                  <button
                    type="button"
                    className={[styles.filterOption, selected ? styles.filterOptionSelected : '']
                      .filter(Boolean)
                      .join(' ')}
                    role="option"
                    aria-selected={selected}
                    onClick={() => onChange(option.label === UPCOMING_ALL ? '' : option.label)}
                  >
                    <span>{option.label}</span>
                    {'hint' in option && option.hint ? (
                      <span className={styles.filterOptionHint}> {option.hint}</span>
                    ) : null}
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

function FiltersBar({
  className,
  filters,
  openKey,
  onToggle,
  onSearchChange,
  onChange,
  onReset,
}: {
  className?: string;
  filters: FilterValues;
  openKey: FilterKey | null;
  onToggle: (key: FilterKey) => void;
  onSearchChange: (value: string) => void;
  onChange: (key: FilterKey, value: string) => void;
  onReset: () => void;
}) {
  const isDirty =
    filters.search.trim() !== '' || filters.level !== '' || filters.upcoming !== '';

  return (
    <section
      className={[styles.filters, className].filter(Boolean).join(' ')}
      aria-label="Фильтры"
    >
      <div className={styles.filtersFields}>
        <label className={styles.searchField}>
          <span className={styles.visuallyHidden}>{ts.searchPlaceholder}</span>
          <span className={styles.searchIcon}>
            <img src={iconSearch} alt="" width={20} height={20} />
          </span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={ts.searchPlaceholder}
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <FilterSelect
          label={ts.levelLabel}
          placeholder={ts.levelPlaceholder}
          options={LEVEL_OPTIONS}
          value={filters.level}
          allValue={LEVEL_ALL}
          open={openKey === 'level'}
          onToggle={() => onToggle('level')}
          onChange={(value) => onChange('level', value)}
        />
        <UpcomingFilterSelect
          label={ts.upcomingLabel}
          placeholder={ts.upcomingPlaceholder}
          value={filters.upcoming}
          open={openKey === 'upcoming'}
          onToggle={() => onToggle('upcoming')}
          onChange={(value) => onChange('upcoming', value)}
        />
      </div>
      <button
        type="button"
        className={[styles.resetBtn, isDirty ? styles.resetBtnActive : ''].filter(Boolean).join(' ')}
        disabled={!isDirty}
        onClick={onReset}
      >
        <span className={styles.resetIcon}>
          <img src={isDirty ? iconResetActive : iconReset} alt="" width={16.8} height={18.68} />
        </span>
        {ts.resetFilters}
      </button>
    </section>
  );
}

function MobileFiltersMenu({
  open,
  filters,
  onClose,
  onChange,
}: {
  open: boolean;
  filters: FilterValues;
  onClose: () => void;
  onChange: (key: FilterKey, value: string) => void;
}) {
  const [view, setView] = useState<FilterKey | null>(null);
  const [activeNav, setActiveNav] = useState<FilterKey>('level');

  useEffect(() => {
    if (!open) {
      setView(null);
      setActiveNav('level');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const activeItem = MOBILE_FILTER_ITEMS.find((item) => item.key === view);
  const allValue = view === 'upcoming' ? UPCOMING_ALL : LEVEL_ALL;

  return (
    <>
      <button
        type="button"
        className={styles.mobileFiltersBackdrop}
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div className={styles.mobileFiltersMenu} role="dialog" aria-label={ts.openFilters}>
        {activeItem ? (
          activeItem.options.map((option) => {
            const selected = isFilterSelected(filters[activeItem.key], option, allValue);
            const upcomingOption =
              activeItem.key === 'upcoming'
                ? UPCOMING_OPTIONS.find((item) => item.label === option)
                : undefined;
            const hint =
              upcomingOption && 'hint' in upcomingOption ? upcomingOption.hint : undefined;
            return (
              <button
                key={option}
                type="button"
                className={[
                  styles.mobileFiltersItem,
                  selected ? styles.mobileFiltersItemActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  onChange(activeItem.key, option === allValue ? '' : option);
                  onClose();
                }}
              >
                <span className={styles.mobileFiltersItemLabel}>
                  {option}
                  {hint ? <span className={styles.filterOptionHint}> {hint}</span> : null}
                </span>
              </button>
            );
          })
        ) : (
          MOBILE_FILTER_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={[
                styles.mobileFiltersItem,
                activeNav === item.key ? styles.mobileFiltersItemActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setActiveNav(item.key)}
              onFocus={() => setActiveNav(item.key)}
              onClick={() => setView(item.key)}
            >
              <span className={styles.mobileFiltersItemLabel}>{item.label}</span>
              <span className={styles.mobileFiltersItemChevron}>
                <img src={iconArrowLite} alt="" width={14} height={14} />
              </span>
            </button>
          ))
        )}
      </div>
    </>
  );
}

function StudentCardView({ student }: { student: StudentCard }) {
  return (
    <Link to="/student" className={styles.studentCard}>
      <div className={styles.studentIdentity}>
        <img
          src={student.photo}
          alt=""
          className={styles.studentPhoto}
          width={160}
          height={192}
        />
        <div className={styles.studentSummary}>
          <h2 className={styles.studentName}>{student.name}</h2>
          <div className={styles.badges}>
            <span className={styles.badge}>{student.badges.level}</span>
            <span className={styles.badge}>{student.badges.course}</span>
            <span className={styles.badge}>{student.badges.time}</span>
          </div>
        </div>
      </div>
      <div className={styles.studentMeta}>
        <div className={styles.metaItem}>
          <IconImg src={iconCalendar} box={40} size={22.4} />
          <div className={styles.metaText}>
            <span className={styles.metaLabel}>{ts.lastLessonLabel}</span>
            <span className={styles.metaValue}>{student.lastLesson}</span>
          </div>
        </div>
        <div className={styles.metaItem}>
          <IconImg src={iconSlot} box={40} size={22.4} />
          <div className={styles.metaText}>
            <span className={styles.metaLabel}>{ts.nextLessonLabel}</span>
            <span className={styles.metaValue}>{student.nextLesson}</span>
          </div>
        </div>
        <div className={styles.metaItem}>
          <IconImg src={iconBookSm} box={40} size={22.4} />
          <div className={styles.metaText}>
            <span className={styles.metaLabel}>{ts.lessonsCountLabel}</span>
            <span className={styles.metaValue}>{student.lessonsCount}</span>
          </div>
        </div>
      </div>
    </Link>
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
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label="Пагинация">
      <button
        type="button"
        className={styles.pageArrow}
        aria-label={ts.paginationPrev}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <img src={iconArrowLite} alt="" width={20} height={20} className={styles.pageArrowPrev} />
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={[styles.pageBtn, page === pageNumber ? styles.pageBtnActive : '']
            .filter(Boolean)
            .join(' ')}
          aria-current={page === pageNumber ? 'page' : undefined}
          onClick={() => onChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      {totalPages > 3 ? <span className={styles.pageDots}>…</span> : null}
      <button
        type="button"
        className={styles.pageArrow}
        aria-label={ts.paginationNext}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        <img src={iconArrowLite} alt="" width={20} height={20} />
      </button>
    </nav>
  );
}

function EmptyStudentsState() {
  return (
    <div className={styles.emptyCard}>
      <div className={styles.emptyContent}>
        <span className={styles.emptyIcon}>
          <img src={iconEmptyStudents} alt="" width={70} height={70} className={styles.emptyIconImg} />
        </span>
        <div className={styles.emptyText}>
          <p className={styles.emptyTitle}>{ts.emptyTitle}</p>
          <p className={styles.emptyDescription}>{ts.emptyDescription}</p>
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="Мобильная навигация">
      <Link to="/home" className={styles.bottomNavItem}>
        <IconImg src={iconHome} box={32} size={22.4} />
        <span>{th.mobileNavHome}</span>
      </Link>
      <Link to="/schedule" className={styles.bottomNavItem}>
        <IconImg src={iconCalendar} box={32} size={22.4} />
        <span>{th.mobileNavSchedule}</span>
      </Link>
      <button type="button" className={`${styles.bottomNavItem} ${styles.bottomNavSlot}`}>
        <IconImg src={iconPencilNav} box={32} size={28} />
        <span>{th.mobileNavSlot}</span>
      </button>
      <Link to="/lesson" className={styles.bottomNavItem}>
        <IconImg src={iconBook} box={32} size={22.4} />
        <span>{th.mobileNavLessons}</span>
      </Link>
      <button type="button" className={styles.bottomNavItem}>
        <IconImg src={iconDots} box={32} size={22.4} />
        <span>{th.mobileNavMore}</span>
      </button>
    </nav>
  );
}

export function TeacherStudentsPage() {
  const session = getSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const students = useMemo(
    () => getStudents(searchParams.get('empty') === '1'),
    [searchParams],
  );

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return students.filter((student) => {
      if (query && !student.name.toLowerCase().includes(query)) return false;
      if (filters.level && filters.level !== LEVEL_ALL && student.levelKey !== filters.level) {
        return false;
      }
      if (
        filters.upcoming &&
        filters.upcoming !== UPCOMING_ALL &&
        student.timeKey !== filters.upcoming
      ) {
        return false;
      }
      return true;
    });
  }, [filters, students]);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  const handleSearchChange = (search: string) => {
    setFilters((current) => ({ ...current, search }));
    setPage(1);
  };

  const handleFilterChange = (key: FilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setOpenKey(null);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setOpenKey(null);
    setPage(1);
  };

  const isEmpty = filtered.length === 0;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className={styles.page}>
      <div
        className={[styles.shell, sidebarExpanded ? styles.shellExpanded : ''].filter(Boolean).join(' ')}
      >
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((value) => !value)}
          onLogout={handleLogout}
        />
        <div className={styles.main}>
          <Topbar />

          <div className={styles.mobileSearchRow}>
            <label className={styles.mobileSearchField}>
              <span className={styles.visuallyHidden}>{ts.searchPlaceholder}</span>
              <span className={styles.mobileSearchIcon}>
                <img src={iconSearch} alt="" width={14} height={14} />
              </span>
              <input
                type="search"
                className={styles.mobileSearchInput}
                placeholder={ts.searchPlaceholder}
                value={filters.search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </label>
            <div className={styles.mobileFilterWrap}>
              <button
                type="button"
                className={styles.mobileFilterBtn}
                aria-label={ts.openFilters}
                aria-expanded={mobileFiltersOpen}
                onClick={() => setMobileFiltersOpen((value) => !value)}
              >
                <img src={iconFilterSliders} alt="" width={24} height={23.14} />
              </button>
              <MobileFiltersMenu
                open={mobileFiltersOpen}
                filters={filters}
                onClose={() => setMobileFiltersOpen(false)}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <FiltersBar
            className={styles.filtersDesktop}
            filters={filters}
            openKey={openKey}
            onToggle={(key) => setOpenKey((current) => (current === key ? null : key))}
            onSearchChange={handleSearchChange}
            onChange={handleFilterChange}
            onReset={handleReset}
          />

          <div className={styles.results}>
            <p className={styles.found}>
              <span>{ts.found}</span>
              <span className={styles.foundCount}>{filtered.length}</span>
            </p>
            {isEmpty ? (
              <EmptyStudentsState />
            ) : (
              <>
                <div className={styles.grid}>
                  {pageItems.map((student) => (
                    <StudentCardView key={student.id} student={student} />
                  ))}
                </div>
                <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </main>
  );
}
