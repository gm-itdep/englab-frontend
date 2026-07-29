import { useEffect, useId, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import { t } from '../../shared/i18n';
import iconLogoMark from '../../assets/icons/teacher/logo-mark.svg';
import iconHome from '../../assets/icons/teacher/home.svg';
import iconCalendar from '../../assets/icons/teacher/calendar.svg';
import iconBook from '../../assets/icons/teacher/book.svg';
import iconStudents from '../../assets/icons/teacher/students.svg';
import iconExit from '../../assets/icons/teacher/exit.svg';
import iconNotification from '../../assets/icons/teacher/notification.svg';
import iconSearch from '../../assets/icons/teacher/search.svg';
import iconChevron from '../../assets/icons/teacher/chevron.svg';
import iconArrow from '../../assets/icons/teacher/arrow.svg';
import iconArrowLite from '../../assets/icons/teacher/arrow-lite.svg';
import iconTime from '../../assets/icons/teacher/time.svg';
import iconReset from '../../assets/icons/teacher/reset-filters.svg';
import iconResetActive from '../../assets/icons/teacher/reset-filters-active.svg';
import iconFilter from '../../assets/icons/teacher/filter.svg';
import iconFilterSliders from '../../assets/icons/teacher/filter-sliders.svg';
import iconPencilNav from '../../assets/icons/teacher/pencil-nav.svg';
import iconDots from '../../assets/icons/teacher/dots.svg';
import iconAttention from '../../assets/icons/teacher/attention.svg';
import iconModalClose from '../../assets/icons/modal-close.svg';
import imgAvatarTeacher from '../../assets/images/teacher/avatar-teacher.png';
import imgAvatarMobile from '../../assets/images/teacher/avatar-mobile.png';
import logoEnglab from '../../assets/images/logo-englab.svg';
import { Button } from '../../components/ui';
import {
  buildWeekDays,
  formatSelectionDate,
  formatWeekRange,
  getSlot,
  INITIAL_SELECTION,
  isSameSlot,
  slotStartLabel,
  type ScheduleSlot,
  type SlotSelection,
  type SlotStatus,
  type WeekDay,
} from './scheduleData';
import styles from './TeacherSchedulePage.module.css';

const th = t.teacherHome;
const ts = t.teacherSchedule;

type FilterKey = 'days' | 'status' | 'duration' | 'type';

type FilterValues = Record<FilterKey, string>;

const DEFAULT_FILTERS: FilterValues = {
  days: ts.filterDaysOptions[0],
  status: ts.filterStatusOptions[0],
  duration: '60 минут',
  type: 'Индивидуально',
};

const FILTER_TRIGGER_LABELS: Partial<Record<string, string>> = {
  [ts.filterDaysOptions[0]]: ts.filterDaysValue,
};

const SLOT_STATUS_LABEL: Record<SlotStatus, string> = {
  free: ts.free,
  busy: ts.busy,
  completed: ts.completed,
  unavailable: ts.unavailable,
};

const SLOT_INNER_CLASS: Record<SlotStatus, string> = {
  free: styles.slotFree,
  busy: styles.slotBusy,
  completed: styles.slotCompleted,
  unavailable: styles.slotUnavailable,
};

const MOBILE_SLOT_CLASS: Record<SlotStatus, string> = {
  free: styles.mobileSlotFree,
  busy: styles.mobileSlotBusy,
  completed: styles.mobileSlotCompleted,
  unavailable: styles.mobileSlotUnavailable,
};

function selectionTypeLabel(slot: ScheduleSlot): string {
  if (slot.status === 'free') {
    return ts.selectionTypeValue;
  }
  return SLOT_STATUS_LABEL[slot.status];
}

function SlotInnerContent({
  slot,
  timeRange,
  selected,
  asConflict,
}: {
  slot: ScheduleSlot;
  timeRange: string;
  selected: boolean;
  asConflict: boolean;
}) {
  if (asConflict) {
    return (
      <span className={styles.slotConflictIcon}>
        <img src={iconAttention} alt="" width={24} height={24} />
      </span>
    );
  }

  if (slot.status === 'free' && selected) {
    return <>{slotStartLabel(timeRange)}</>;
  }

  if (slot.status === 'busy') {
    return (
      <>
        <span className={styles.slotBusyLine}>{ts.busy}</span>
        {slot.studentName ? (
          <span className={styles.slotBusyLine}>{slot.studentName}</span>
        ) : null}
      </>
    );
  }

  return <>{SLOT_STATUS_LABEL[slot.status]}</>;
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

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const topItems = [
    { icon: iconHome, iconSize: 28, label: th.navHome, to: '/home', active: false },
    { icon: iconCalendar, iconSize: 22.4, label: th.navCalendar, to: '/schedule', active: true },
    { icon: iconBook, iconSize: 22.4, label: th.navBook, to: '/lesson', active: false },
    { icon: iconStudents, iconSize: 22.4, label: th.navStudents, to: '/students', active: false },
  ] as const;

  const bottomItems = [
    { icon: iconNotification, iconSize: 22.4, label: th.notifications, onClick: undefined },
    { icon: iconExit, iconSize: 22.4, label: th.logout, onClick: onLogout },
  ] as const;

  return (
    <aside className={styles.sidebar} aria-label="Навигация">
      <div className={styles.logoMark}>
        <img src={logoEnglab} alt={t.common.brand} className={styles.logoFull} width={110} height={27} />
        <img src={iconLogoMark} alt="" className={styles.logoCompact} width={38} height={26} />
      </div>
      <div className={styles.sidebarMenu}>
        <nav className={styles.sidebarNav}>
          {topItems.map((item) => {
            const className = [styles.navBtn, item.active ? styles.navBtnActive : '']
              .filter(Boolean)
              .join(' ');
            return (
              <Link
                key={item.label}
                to={item.to}
                className={className}
                aria-current={item.active ? 'page' : undefined}
                aria-label={item.label}
              >
                <IconImg src={item.icon} box={32} size={item.iconSize} />
                <span className={styles.navLabel}>{item.label}</span>
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
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SearchField({
  placeholder,
  className,
  alignStart,
}: {
  placeholder: string;
  className?: string;
  alignStart?: boolean;
}) {
  return (
    <label
      className={[styles.search, alignStart ? styles.searchAlignStart : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.searchIcon}>
        <img src={iconSearch} alt="" width={14} height={14} />
      </span>
      <input type="search" placeholder={placeholder} aria-label={placeholder} />
    </label>
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
        <SearchField placeholder={th.searchDesktop} className={styles.searchDesktop} />
        <button type="button" className={styles.iconButton} aria-label={th.notifications}>
          <span className={styles.notifIcon}>
            <img src={iconNotification} alt="" width={22.4} height={22.4} />
          </span>
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
  options,
  value,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  open: boolean;
  onToggle: () => void;
  onChange: (next: string) => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerLabel = FILTER_TRIGGER_LABELS[value] ?? value;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onToggle();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onToggle();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onToggle]);

  return (
    <div className={styles.filterField} ref={rootRef}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.filterSelectWrap}>
        <button
          type="button"
          className={[styles.filterSelect, open ? styles.filterSelectOpen : ''].filter(Boolean).join(' ')}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={onToggle}
        >
          <span>{triggerLabel}</span>
          <span className={[styles.filterChevron, open ? styles.filterChevronOpen : ''].filter(Boolean).join(' ')}>
            <img src={iconArrowLite} alt="" width={14} height={14} />
          </span>
        </button>
        {open ? (
          <ul id={listId} className={styles.filterDropdown} role="listbox" aria-label={label}>
            {options.map((option) => {
              const selected = option === value;
              return (
                <li key={option} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={[styles.filterOption, selected ? styles.filterOptionSelected : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      onChange(option);
                      if (open) onToggle();
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

function FiltersBar({
  className,
  filters,
  openKey,
  onToggle,
  onChange,
  onReset,
}: {
  className?: string;
  filters: FilterValues;
  openKey: FilterKey | null;
  onToggle: (key: FilterKey) => void;
  onChange: (key: FilterKey, value: string) => void;
  onReset: () => void;
}) {
  const isDirty =
    filters.days !== DEFAULT_FILTERS.days ||
    filters.status !== DEFAULT_FILTERS.status ||
    filters.duration !== DEFAULT_FILTERS.duration ||
    filters.type !== DEFAULT_FILTERS.type;

  return (
    <section className={[styles.filters, className].filter(Boolean).join(' ')} aria-label="Фильтры">
      <div className={styles.filtersFields}>
        <FilterSelect
          label={ts.filterDays}
          options={ts.filterDaysOptions}
          value={filters.days}
          open={openKey === 'days'}
          onToggle={() => onToggle('days')}
          onChange={(value) => onChange('days', value)}
        />
        <FilterSelect
          label={ts.filterStatus}
          options={ts.filterStatusOptions}
          value={filters.status}
          open={openKey === 'status'}
          onToggle={() => onToggle('status')}
          onChange={(value) => onChange('status', value)}
        />
        <FilterSelect
          label={ts.filterDuration}
          options={ts.filterDurationOptions}
          value={filters.duration}
          open={openKey === 'duration'}
          onToggle={() => onToggle('duration')}
          onChange={(value) => onChange('duration', value)}
        />
        <FilterSelect
          label={ts.filterType}
          options={ts.filterTypeOptions}
          value={filters.type}
          open={openKey === 'type'}
          onToggle={() => onToggle('type')}
          onChange={(value) => onChange('type', value)}
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

const MOBILE_FILTER_ITEMS: { key: FilterKey; label: string; options: readonly string[] }[] = [
  { key: 'days', label: ts.filterMenuDays, options: ts.filterDaysOptions },
  { key: 'status', label: ts.filterMenuStatus, options: ts.filterStatusOptions },
  { key: 'duration', label: ts.filterMenuDuration, options: ts.filterDurationOptions },
  { key: 'type', label: ts.filterMenuType, options: ts.filterTypeOptions },
];

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
  const [activeNav, setActiveNav] = useState<FilterKey>('days');

  useEffect(() => {
    if (!open) {
      setView(null);
      setActiveNav('days');
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
            const selected = filters[activeItem.key] === option;
            const label = FILTER_TRIGGER_LABELS[option] ?? option;
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
                  onChange(activeItem.key, option);
                  onClose();
                }}
              >
                <span className={styles.mobileFiltersItemLabel}>{label}</span>
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

function TimezoneRow({ className }: { className?: string }) {
  return (
    <div className={[styles.timezoneRow, className].filter(Boolean).join(' ')}>
      <div className={styles.timezoneInfo}>
        <span className={styles.timezoneIcon}>
          <img src={iconTime} alt="" width={16.8} height={16.8} />
        </span>
        <span>{ts.timezone}</span>
      </div>
      <button type="button" className={styles.changeBtn}>
        {ts.changeTimezone}
      </button>
    </div>
  );
}

function SelectionSummary({
  selection,
  weekOffset,
}: {
  selection: SlotSelection | null;
  weekOffset: number;
}) {
  const hasSelection = selection !== null;
  const time = hasSelection ? ts.timeRows[selection.timeIndex] : undefined;
  const slot = hasSelection
    ? getSlot(selection.dayIndex, selection.timeIndex, weekOffset)
    : null;
  const canCreate = slot?.status === 'free';

  let dateValue: string = ts.selectionEmptyValue;
  let durationValue: string = ts.selectionEmptyValue;
  let typeValue: string = ts.selectionEmptyValue;

  if (hasSelection && slot) {
    dateValue = formatSelectionDate(weekOffset, selection.dayIndex);
    durationValue = time ?? ts.selectionEmptyValue;
    typeValue = selectionTypeLabel(slot);
  }

  return (
    <>
      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>{ts.selectionTitle}</h2>
        <div className={styles.summaryBody}>
          <div className={styles.summaryParams}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{ts.selectionDate}</span>
              <span className={styles.summaryValue}>{dateValue}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{ts.selectionDuration}</span>
              <span className={styles.summaryValue}>{durationValue}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{ts.selectionType}</span>
              <span className={styles.summaryValue}>{typeValue}</span>
            </div>
          </div>
          {canCreate ? <p className={styles.summaryHint}>{ts.selectionHint}</p> : null}
        </div>
      </div>
      {canCreate ? (
        <Button type="button" variant="primary" fullWidth className={styles.createSlotBtn}>
          {ts.createSlot}
        </Button>
      ) : null}
    </>
  );
}

function ConflictToast({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.conflictToast} role="alert">
      <span className={styles.conflictToastIcon}>
        <img src={iconAttention} alt="" width={45} height={45} />
      </span>
      <div className={styles.conflictToastText}>
        <p className={styles.conflictToastTitle}>{ts.conflictTitle}</p>
        <p className={styles.conflictToastMessage}>{ts.conflictMessage}</p>
      </div>
      <button
        type="button"
        className={styles.conflictToastClose}
        aria-label={ts.conflictClose}
        onClick={onClose}
      >
        <img src={iconModalClose} alt="" width={22} height={22} />
      </button>
    </div>
  );
}

function MobileSlotContent({
  slot,
  timeRange,
  selected,
  asConflict,
}: {
  slot: ScheduleSlot;
  timeRange: string;
  selected: boolean;
  asConflict: boolean;
}) {
  if (asConflict) {
    return (
      <>
        <span className={styles.mobileSlotErrorLabel}>{ts.error}</span>
        <span className={styles.mobileSlotConflictIcon}>
          <img src={iconAttention} alt="" width={14} height={14} />
        </span>
      </>
    );
  }

  const time = slotStartLabel(timeRange);
  const status =
    selected && slot.status === 'free'
      ? ts.selected
      : slot.status === 'busy'
        ? (slot.studentName ?? ts.busy)
        : SLOT_STATUS_LABEL[slot.status];

  return (
    <>
      <span className={styles.mobileSlotTime}>{time}</span>
      <span className={styles.mobileSlotStatus}>{status}</span>
    </>
  );
}

function ScheduleGrid({
  selection,
  conflictSlot,
  weekOffset,
  weekDays,
  weekRange,
  onSelect,
  onWeekChange,
  onOpenFilters,
}: {
  selection: SlotSelection | null;
  conflictSlot: SlotSelection | null;
  weekOffset: number;
  weekDays: WeekDay[];
  weekRange: string;
  onSelect: (next: SlotSelection | null) => void;
  onWeekChange: (delta: number) => void;
  onOpenFilters: () => void;
}) {
  const selectSlot = (dayIndex: number, timeIndex: number) => {
    const slot = getSlot(dayIndex, timeIndex, weekOffset);
    if (slot.status === 'free' && isSameSlot(selection, { dayIndex, timeIndex })) {
      onSelect(null);
      return;
    }
    onSelect({ dayIndex, timeIndex });
  };

  const selectDay = (dayIndex: number) => {
    onSelect({
      dayIndex,
      timeIndex: selection?.timeIndex ?? INITIAL_SELECTION.timeIndex,
    });
  };

  const isConflictCell = (dayIndex: number, timeIndex: number) =>
    isSameSlot(conflictSlot, { dayIndex, timeIndex });

  return (
    <section className={styles.gridCard}>
      <div className={styles.gridHeader}>
        <h2 className={`${styles.weekTitle} ${styles.hideMobile}`}>{weekRange}</h2>
        <div className={`${styles.weekNav} ${styles.hideMobile}`}>
          <button
            type="button"
            className={styles.weekNavBtn}
            aria-label={ts.prevWeek}
            onClick={() => onWeekChange(-1)}
          >
            <span className={styles.arrowPrev}>
              <IconImg src={iconArrow} box={40} size={28} />
            </span>
          </button>
          <button
            type="button"
            className={styles.weekNavBtn}
            aria-label={ts.nextWeek}
            onClick={() => onWeekChange(1)}
          >
            <IconImg src={iconArrow} box={40} size={28} />
          </button>
        </div>

        <div className={styles.mobileWeekHeader}>
          <div className={styles.mobileWeekNav}>
            <button
              type="button"
              className={styles.mobileWeekNavBtn}
              aria-label={ts.prevWeek}
              onClick={() => onWeekChange(-1)}
            >
              <span className={styles.arrowPrev}>
                <IconImg src={iconChevron} box={40} size={15} />
              </span>
            </button>
            <p className={styles.mobileWeekTitle}>{weekRange}</p>
            <button
              type="button"
              className={styles.mobileWeekNavBtn}
              aria-label={ts.nextWeek}
              onClick={() => onWeekChange(1)}
            >
              <span className={styles.arrowNextMobile}>
                <IconImg src={iconChevron} box={40} size={15} />
              </span>
            </button>
          </div>
          <button
            type="button"
            className={styles.gridFilterBtn}
            aria-label={ts.openFilters}
            onClick={onOpenFilters}
          >
            <img src={iconFilter} alt="" width={22.4} height={22.4} />
          </button>
        </div>
      </div>

      <div className={`${styles.scheduleGrid} ${styles.hideMobile}`}>
        <div className={styles.dayHeaders}>
          <div className={styles.timeCorner} aria-hidden="true" />
          {weekDays.map((day, dayIndex) => (
            <div
              key={`${day.fullDate.toISOString()}-header`}
              className={[
                styles.dayHeader,
                selection?.dayIndex === dayIndex ? styles.dayHeaderActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className={styles.dayWeekday}>{day.weekday}</span>
              <span className={styles.dayDate}>{day.date}</span>
            </div>
          ))}
        </div>

        <div className={styles.slotsBody}>
          <div className={styles.timeColumn}>
            {ts.timeRows.map((row) => (
              <div key={row} className={styles.timeLabel}>
                {row}
              </div>
            ))}
          </div>

          {weekDays.map((day, dayIndex) => (
            <div key={`${day.fullDate.toISOString()}-col`} className={styles.dayColumn}>
              {ts.timeRows.map((row, timeIndex) => {
                const slot = getSlot(dayIndex, timeIndex, weekOffset);
                const selected = isSameSlot(selection, { dayIndex, timeIndex });
                const asConflict = isConflictCell(dayIndex, timeIndex);
                const showSelected = selected && slot.status === 'free';
                const innerClass = asConflict
                  ? styles.slotConflict
                  : showSelected
                    ? styles.slotSelected
                    : SLOT_INNER_CLASS[slot.status];
                return (
                  <button
                    key={`${day.fullDate.toISOString()}-${row}`}
                    type="button"
                    className={styles.slotCell}
                    onClick={() => selectSlot(dayIndex, timeIndex)}
                    aria-pressed={selected}
                  >
                    <span className={[styles.slotInner, innerClass].filter(Boolean).join(' ')}>
                      <SlotInnerContent
                        slot={slot}
                        timeRange={row}
                        selected={selected}
                        asConflict={asConflict}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mobileSchedule}>
        <div className={styles.mobileDays}>
          {weekDays.map((day, dayIndex) => (
            <button
              key={`${day.fullDate.toISOString()}-day`}
              type="button"
              className={[
                styles.mobileDay,
                selection?.dayIndex === dayIndex ? styles.mobileDayActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => selectDay(dayIndex)}
              aria-pressed={selection?.dayIndex === dayIndex}
            >
              <span className={styles.dayWeekday}>{day.weekday}</span>
              <span className={styles.mobileDayNum}>{day.dayNum}</span>
            </button>
          ))}
        </div>

        <div className={styles.mobileSlots}>
          {ts.timeRows.map((row, timeIndex) => {
            const dayIndex = selection?.dayIndex ?? INITIAL_SELECTION.dayIndex;
            const slot = getSlot(dayIndex, timeIndex, weekOffset);
            const isSelected = isSameSlot(selection, { dayIndex, timeIndex });
            const asConflict = isConflictCell(dayIndex, timeIndex);
            const showSelected = isSelected && slot.status === 'free';
            const mobileClass = asConflict
              ? styles.mobileSlotConflict
              : showSelected
                ? styles.mobileSlotSelected
                : MOBILE_SLOT_CLASS[slot.status];
            return (
              <button
                key={row}
                type="button"
                className={[styles.mobileSlot, mobileClass].filter(Boolean).join(' ')}
                onClick={() => selectSlot(dayIndex, timeIndex)}
                aria-pressed={isSelected}
              >
                <MobileSlotContent
                  slot={slot}
                  timeRange={row}
                  selected={isSelected}
                  asConflict={asConflict}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SidePanel({
  selection,
  weekOffset,
}: {
  selection: SlotSelection | null;
  weekOffset: number;
}) {
  return (
    <aside className={styles.sidePanel}>
      <TimezoneRow className={styles.hideMobile} />
      <SelectionSummary selection={selection} weekOffset={weekOffset} />
    </aside>
  );
}

function MobileBottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="Мобильная навигация">
      <Link to="/home" className={styles.bottomNavItem}>
        <IconImg src={iconHome} box={32} size={22.4} />
        <span>{th.mobileNavHome}</span>
      </Link>
      <Link
        to="/schedule"
        className={`${styles.bottomNavItem} ${styles.bottomNavActive}`}
        aria-current="page"
      >
        <IconImg src={iconCalendar} box={32} size={22.4} />
        <span>{th.mobileNavSchedule}</span>
      </Link>
      <button type="button" className={styles.bottomNavItem}>
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

export function TeacherSchedulePage() {
  const session = getSession();
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selection, setSelection] = useState<SlotSelection | null>(INITIAL_SELECTION);
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [conflictSlot, setConflictSlot] = useState<SlotSelection | null>(null);

  const weekDays = buildWeekDays(weekOffset);
  const weekRange = formatWeekRange(weekOffset);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  const handleWeekChange = (delta: number) => {
    setWeekOffset((prev) => prev + delta);
    setSelection(null);
    setConflictSlot(null);
  };

  const handleSelect = (next: SlotSelection | null) => {
    setSelection(next);
    if (next === null) {
      setConflictSlot(null);
      return;
    }
    const slot = getSlot(next.dayIndex, next.timeIndex, weekOffset);
    if (slot.status === 'busy') {
      setConflictSlot(next);
      return;
    }
    if (slot.status === 'free') {
      setConflictSlot(null);
    }
  };

  const toggleFilterKey = (key: FilterKey) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const changeFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setOpenKey(null);
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Sidebar onLogout={handleLogout} />
        <div className={styles.main}>
          <Topbar />

          <div className={styles.mobileSearchRow}>
            <SearchField
              placeholder={th.searchMobile}
              className={styles.searchMobile}
              alignStart
            />
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
                onChange={changeFilter}
              />
            </div>
          </div>

          <FiltersBar
            className={styles.filtersDesktop}
            filters={filters}
            openKey={openKey}
            onToggle={toggleFilterKey}
            onChange={changeFilter}
            onReset={resetFilters}
          />

          <TimezoneRow className={styles.timezoneMobile} />

          <div className={styles.content}>
            <ScheduleGrid
              selection={selection}
              conflictSlot={conflictSlot}
              weekOffset={weekOffset}
              weekDays={weekDays}
              weekRange={weekRange}
              onSelect={handleSelect}
              onWeekChange={handleWeekChange}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />
            <SidePanel selection={selection} weekOffset={weekOffset} />
          </div>

          <div className={styles.summaryMobile}>
            <SelectionSummary selection={selection} weekOffset={weekOffset} />
          </div>
        </div>
      </div>

      {conflictSlot ? <ConflictToast onClose={() => setConflictSlot(null)} /> : null}

      <MobileBottomNav />
    </main>
  );
}
