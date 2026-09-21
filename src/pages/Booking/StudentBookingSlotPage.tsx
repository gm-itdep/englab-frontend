import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StudentLayout } from '../Home/StudentLayout';
import { Button } from '../../components/ui';
import { BookingConfirmModal } from './BookingConfirmModal';
import ICON_ARROW from '../../assets/icons/student/arrow.svg';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import ICON_CHEVRON from '../../assets/icons/student/chevron.svg';
import ICON_SEARCH from '../../assets/icons/student/search.svg';
import ICON_FILTER from '../../assets/icons/student/filter.svg';
import ICON_FILTER_SLIDERS from '../../assets/icons/student/booking/filter-sliders.svg';
import ICON_STAR from '../../assets/icons/student/booking/star.svg';
import ICON_RETURN from '../../assets/icons/student/booking/return.svg';
import ICON_RETURN_ACTIVE from '../../assets/icons/student/booking/return-active.svg';
import ICON_TIME from '../../assets/icons/student/time.svg';
import ICON_INFO from '../../assets/icons/student/booking/info.svg';
import {
  BOOKING_TEACHERS,
  DEFAULT_SLOT_FILTERS,
  SLOT_COST_CREDITS,
  SLOT_COST_LABEL,
  SLOT_DAY_OPTIONS,
  SLOT_DURATION_OPTIONS,
  SLOT_FILTER_TRIGGER_LABELS,
  SLOT_STATUS_OPTIONS,
  SLOT_TIME_ROWS,
  SLOT_TYPE_OPTIONS,
  STUDENT_BALANCE_LOW_CREDITS,
  type BookingTeacher,
  type SlotFilterKey,
  type SlotFilterValues,
} from './bookingData';
import {
  buildWeekDays,
  formatSelectionDate,
  formatWeekRange,
  isSameSlot,
  slotStartLabel,
  type SlotSelection,
} from '../Schedule/scheduleData';
import styles from './StudentBookingSlotPage.module.css';

const INITIAL_SELECTION: SlotSelection = { dayIndex: 3, timeIndex: 4 };
const TODAY_INDEX = 2;

const FILTER_ITEMS: {
  key: SlotFilterKey;
  label: string;
  menuLabel: string;
  options: readonly string[];
}[] = [
  { key: 'days', label: 'Дни недели', menuLabel: 'Дни недели', options: SLOT_DAY_OPTIONS },
  { key: 'status', label: 'Отображение', menuLabel: 'Отображение', options: SLOT_STATUS_OPTIONS },
  { key: 'duration', label: 'Длительность', menuLabel: 'Длительность', options: SLOT_DURATION_OPTIONS },
  { key: 'type', label: 'Тип урока', menuLabel: 'Тип', options: SLOT_TYPE_OPTIONS },
];

function triggerLabel(value: string): string {
  return SLOT_FILTER_TRIGGER_LABELS[value] ?? value;
}

function IconBox({ src, size, box }: { src: string; size: number; box: number }) {
  return (
    <span className={styles.iconBox} style={{ width: box, height: box }}>
      <img src={src} alt="" width={size} height={size} />
    </span>
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
          <span>{triggerLabel(value)}</span>
          <span className={[styles.filterChevron, open ? styles.filterChevronOpen : ''].filter(Boolean).join(' ')}>
            <img src={ICON_ARROW_LITE} alt="" width={14} height={14} />
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

function MobileFiltersMenu({
  open,
  filters,
  onClose,
  onChange,
}: {
  open: boolean;
  filters: SlotFilterValues;
  onClose: () => void;
  onChange: (key: SlotFilterKey, value: string) => void;
}) {
  const [view, setView] = useState<SlotFilterKey | null>(null);
  const [activeNav, setActiveNav] = useState<SlotFilterKey>('days');

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

  const activeItem = FILTER_ITEMS.find((item) => item.key === view);

  return (
    <>
      <button type="button" className={styles.mobileFiltersBackdrop} aria-label="Закрыть" onClick={onClose} />
      <div className={styles.mobileFiltersMenu} role="dialog" aria-label="Фильтры">
        {activeItem ? (
          activeItem.options.map((option) => {
            const selected = filters[activeItem.key] === option;
            return (
              <button
                key={option}
                type="button"
                className={[styles.mobileFiltersItem, selected ? styles.mobileFiltersItemActive : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  onChange(activeItem.key, option);
                  onClose();
                }}
              >
                <span className={styles.mobileFiltersItemLabel}>{triggerLabel(option)}</span>
              </button>
            );
          })
        ) : (
          FILTER_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={[styles.mobileFiltersItem, activeNav === item.key ? styles.mobileFiltersItemActive : '']
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setActiveNav(item.key)}
              onFocus={() => setActiveNav(item.key)}
              onClick={() => setView(item.key)}
            >
              <span className={styles.mobileFiltersItemLabel}>{item.menuLabel}</span>
              <span className={styles.mobileFiltersItemChevron}>
                <img src={ICON_ARROW_LITE} alt="" width={14} height={14} />
              </span>
            </button>
          ))
        )}
      </div>
    </>
  );
}

function EmptyWeekBadge({ className }: { className?: string }) {
  return (
    <div className={[styles.weekEmptyBadge, className].filter(Boolean).join(' ')} role="status">
      <span className={styles.weekEmptyIcon}>
        <img src={ICON_INFO} alt="" width={14} height={14} />
      </span>
      <p className={styles.weekEmptyText}>На этой неделе свободных слотов нет</p>
    </div>
  );
}

function TimezoneRow({ className }: { className?: string }) {
  return (
    <div className={[styles.timezoneRow, className].filter(Boolean).join(' ')}>
      <div className={styles.timezoneInfo}>
        <span className={styles.timezoneIcon}>
          <img src={ICON_TIME} alt="" width={17} height={17} />
        </span>
        <span>UTC +3, Москва</span>
      </div>
      <button type="button" className={styles.changeBtn}>
        Изменить
      </button>
    </div>
  );
}

function SelectedTeacherCard({
  teacher,
  duration,
  type,
}: {
  teacher: BookingTeacher;
  duration: string;
  type: string;
}) {
  return (
    <section className={styles.teacherCard} aria-label="Выбранный преподаватель">
      <h2 className={styles.cardTitle}>Выбранный преподаватель</h2>
      <div className={styles.teacherBody}>
        <div className={styles.teacherMain}>
          <img className={styles.teacherPhoto} src={teacher.photo} alt="" width={64} height={64} />
          <div className={styles.teacherHeading}>
            <p className={styles.teacherName}>{teacher.name}</p>
            <p className={styles.rating}>
              <span className={styles.starWrap}>
                <img src={ICON_STAR} alt="" width={17} height={17} />
              </span>
              {teacher.rating}
            </p>
          </div>
        </div>
        <div className={styles.teacherMeta}>
          <div className={styles.teacherMetaTop}>
            <p className={styles.meta}>
              {teacher.language}
              <span className={styles.metaDot}> • </span>
              {teacher.accent}
            </p>
            <ul className={styles.tags}>
              {teacher.tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
          <p className={styles.levels}>
            <span className={styles.levelsLabel}>Уровни:</span>
            <span>{teacher.levels}</span>
          </p>
        </div>
        <div className={styles.teacherDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Тип урока</span>
            <span className={styles.detailValue}>{type === 'Все типы' ? 'Индивидуально' : type}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Длительность</span>
            <span className={styles.detailValue}>
              {duration === 'Любая длительность' ? '60 минут' : duration}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Стоимость</span>
            <span className={styles.detailValue}>{SLOT_COST_LABEL}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectionSummary({
  selection,
  weekOffset,
}: {
  selection: SlotSelection;
  weekOffset: number;
}) {
  const time = SLOT_TIME_ROWS[selection.timeIndex] ?? '—';

  return (
    <section className={styles.summaryCard} aria-label="Итог выбора">
      <h2 className={styles.cardTitle}>Итог выбора</h2>
      <div className={styles.summaryBody}>
        <div className={styles.summaryParams}>
          <div className={styles.summaryRow}>
            <span className={styles.detailLabel}>Дата</span>
            <span className={styles.detailValue}>{formatSelectionDate(weekOffset, selection.dayIndex)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.detailLabel}>Длительность</span>
            <span className={styles.detailValue}>{time}</span>
          </div>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.detailLabel}>Стоимость</span>
          <span className={styles.detailValue}>{SLOT_COST_LABEL}</span>
        </div>
      </div>
    </section>
  );
}

export function StudentBookingSlotPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const teacherId = searchParams.get('teacher');
  const teacher =
    BOOKING_TEACHERS.find((item) => item.id === teacherId) ?? BOOKING_TEACHERS[0];
  const isLoading = searchParams.get('loading') === '1';
  const isEmptyWeek = !isLoading && searchParams.get('empty') === '1';
  const isInsufficient = searchParams.get('insufficient') === '1';
  const isSuccessPreview = searchParams.get('success') === '1';
  const slotsLocked = isLoading || isEmptyWeek;
  const canConfirm = !slotsLocked;
  const missingCredits = isInsufficient
    ? Math.max(0, SLOT_COST_CREDITS - STUDENT_BALANCE_LOW_CREDITS)
    : 0;
  const initialView = isInsufficient ? 'insufficient' : isSuccessPreview ? 'success' : 'confirm';

  const [weekOffset, setWeekOffset] = useState(0);
  const [selection, setSelection] = useState<SlotSelection>(INITIAL_SELECTION);
  const [mobileDay, setMobileDay] = useState(INITIAL_SELECTION.dayIndex);
  const [filters, setFilters] = useState<SlotFilterValues>(DEFAULT_SLOT_FILTERS);
  const [openKey, setOpenKey] = useState<SlotFilterKey | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(
    () => canConfirm && (searchParams.get('confirm') === '1' || isInsufficient || isSuccessPreview),
  );

  const weekDays = buildWeekDays(weekOffset);
  const weekRange = formatWeekRange(weekOffset);
  const isDirty =
    filters.days !== DEFAULT_SLOT_FILTERS.days ||
    filters.status !== DEFAULT_SLOT_FILTERS.status ||
    filters.duration !== DEFAULT_SLOT_FILTERS.duration ||
    filters.type !== DEFAULT_SLOT_FILTERS.type;

  const teachersQuery = (() => {
    const next = new URLSearchParams(searchParams);
    next.delete('teacher');
    next.delete('confirm');
    next.delete('insufficient');
    next.delete('success');
    if (next.get('empty') === '1') {
      next.delete('empty');
      if (next.get('loading') !== '1' && next.get('role')) {
        next.set('loading', '1');
      }
    }
    return next.toString();
  })();

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    if (
      searchParams.get('confirm') !== '1' &&
      searchParams.get('insufficient') !== '1' &&
      searchParams.get('success') !== '1'
    ) {
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete('confirm');
    next.delete('insufficient');
    next.delete('success');
    const query = next.toString();
    navigate({ search: query ? `?${query}` : '' }, { replace: true });
  }, [navigate, searchParams]);

  const handleTopUp = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete('confirm');
    next.delete('insufficient');
    next.delete('success');
    next.delete('teacher');
    const query = next.toString();
    navigate(query ? `/balance/topup?${query}` : '/balance/topup');
  }, [navigate, searchParams]);

  const handleSchedule = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete('confirm');
    next.delete('insufficient');
    next.delete('success');
    next.delete('teacher');
    const query = next.toString();
    navigate(query ? `/schedule?${query}` : '/schedule');
  }, [navigate, searchParams]);

  const handleBack = () => {
    navigate(teachersQuery ? `/booking?${teachersQuery}` : '/booking');
  };

  const handleWeekChange = (delta: number) => {
    setWeekOffset((current) => current + delta);
  };

  const selectSlot = (dayIndex: number, timeIndex: number) => {
    if (slotsLocked) return;
    setSelection({ dayIndex, timeIndex });
    setMobileDay(dayIndex);
  };

  return (
    <StudentLayout
      title="Запись на урок"
      subtitle="Шаг 2 и 3"
      activeNav="booking"
      showBack
      hideMobileSearch
      titleSize="lg"
      onBack={handleBack}
    >
      <div className={styles.pageBody}>
        <div className={styles.mobileToolbar}>
          <label className={styles.search}>
            <span className={styles.searchIcon}>
              <img src={ICON_SEARCH} alt="" width={14} height={14} />
            </span>
            <input type="search" placeholder="Поиск по материалам и урокам" />
          </label>
          <div className={styles.mobileFilterWrap}>
            <button
              type="button"
              className={styles.filterBtn}
              aria-label="Фильтры"
              aria-expanded={mobileFiltersOpen}
              onClick={() => setMobileFiltersOpen((open) => !open)}
            >
              <span className={styles.filterBtnIcon}>
                <img src={ICON_FILTER} alt="" width={22} height={22} />
              </span>
            </button>
            <MobileFiltersMenu
              open={mobileFiltersOpen}
              filters={filters}
              onClose={() => setMobileFiltersOpen(false)}
              onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
            />
          </div>
        </div>

        <section className={styles.filters} aria-label="Фильтры">
          <div className={styles.filtersFields}>
            {FILTER_ITEMS.map((item) => (
              <FilterSelect
                key={item.key}
                label={item.label}
                options={item.options}
                value={filters[item.key]}
                open={openKey === item.key}
                onToggle={() => setOpenKey((current) => (current === item.key ? null : item.key))}
                onChange={(value) => setFilters((current) => ({ ...current, [item.key]: value }))}
              />
            ))}
          </div>
          <button
            type="button"
            className={[styles.resetBtn, isDirty ? styles.resetBtnActive : ''].filter(Boolean).join(' ')}
            disabled={!isDirty}
            onClick={() => {
              setFilters(DEFAULT_SLOT_FILTERS);
              setOpenKey(null);
            }}
          >
            <span className={styles.resetIcon}>
              <img src={isDirty ? ICON_RETURN_ACTIVE : ICON_RETURN} alt="" width={17} height={17} />
            </span>
            Сбросить фильтры
          </button>
        </section>

        <div className={styles.content}>
          <TimezoneRow className={styles.timezoneMobile} />

          <section
            className={styles.gridCard}
            aria-label={isLoading ? 'Загрузка слотов' : 'Слоты'}
            aria-busy={isLoading || undefined}
          >
            <div
              className={[styles.gridHeaderDesktop, isEmptyWeek ? styles.gridHeaderEmpty : '']
                .filter(Boolean)
                .join(' ')}
            >
              <h2 className={styles.weekTitle}>{weekRange}</h2>
              {isEmptyWeek ? <EmptyWeekBadge /> : null}
              <div className={styles.weekNav}>
                <button
                  type="button"
                  className={styles.weekNavBtn}
                  aria-label="Предыдущая неделя"
                  onClick={() => handleWeekChange(-1)}
                >
                  <span className={styles.arrowPrev}>
                    <IconBox src={ICON_ARROW} box={40} size={28} />
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.weekNavBtn}
                  aria-label="Следующая неделя"
                  onClick={() => handleWeekChange(1)}
                >
                  <IconBox src={ICON_ARROW} box={40} size={28} />
                </button>
              </div>
            </div>

            <div className={styles.mobileWeekHeader}>
              <div className={styles.mobileWeekNav}>
                <button
                  type="button"
                  className={styles.mobileWeekNavBtn}
                  aria-label="Предыдущая неделя"
                  onClick={() => handleWeekChange(-1)}
                >
                  <span className={styles.chevronPrev}>
                    <IconBox src={ICON_CHEVRON} box={40} size={15} />
                  </span>
                </button>
                <p className={styles.mobileWeekTitle}>{weekRange}</p>
                <button
                  type="button"
                  className={styles.mobileWeekNavBtn}
                  aria-label="Следующая неделя"
                  onClick={() => handleWeekChange(1)}
                >
                  <span className={styles.chevronNext}>
                    <IconBox src={ICON_CHEVRON} box={40} size={15} />
                  </span>
                </button>
              </div>
              <button
                type="button"
                className={styles.gridFilterBtn}
                aria-label="Фильтры"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <img src={ICON_FILTER_SLIDERS} alt="" width={22} height={22} />
              </button>
            </div>

            {isEmptyWeek ? <EmptyWeekBadge className={styles.weekEmptyBadgeMobile} /> : null}

            <div className={styles.scheduleGrid}>
              <div className={styles.dayHeaders}>
                <div className={styles.timeCorner} aria-hidden="true" />
                {weekDays.map((day, dayIndex) => (
                  <div
                    key={`${day.fullDate.toISOString()}-header`}
                    className={[
                      styles.dayHeader,
                      weekOffset === 0 && dayIndex === TODAY_INDEX ? styles.dayHeaderToday : '',
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
                  {SLOT_TIME_ROWS.map((row) => (
                    <div key={row} className={styles.timeLabel}>
                      {row}
                    </div>
                  ))}
                </div>
                {weekDays.map((day, dayIndex) => (
                  <div key={`${day.fullDate.toISOString()}-col`} className={styles.dayColumn}>
                    {SLOT_TIME_ROWS.map((row, timeIndex) => {
                      const selected =
                        !slotsLocked && isSameSlot(selection, { dayIndex, timeIndex });
                      const innerClass = isLoading
                        ? styles.slotSkeleton
                        : isEmptyWeek
                          ? styles.slotUnavailable
                          : selected
                            ? styles.slotSelected
                            : styles.slotFree;
                      return (
                        <button
                          key={`${day.fullDate.toISOString()}-${row}`}
                          type="button"
                          className={styles.slotCell}
                          onClick={() => selectSlot(dayIndex, timeIndex)}
                          disabled={slotsLocked}
                          aria-pressed={selected || undefined}
                        >
                          <span className={[styles.slotInner, innerClass].filter(Boolean).join(' ')}>
                            {isLoading ? null : (
                              <span className={styles.slotLabel}>
                                {isEmptyWeek
                                  ? 'Недоступен'
                                  : selected
                                    ? slotStartLabel(row)
                                    : 'Свободно'}
                              </span>
                            )}
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
                      !slotsLocked && mobileDay === dayIndex ? styles.mobileDayActive : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setMobileDay(dayIndex)}
                    aria-pressed={!slotsLocked && mobileDay === dayIndex}
                  >
                    <span className={styles.dayWeekday}>{day.weekday}</span>
                    <span className={styles.mobileDayNum}>{day.dayNum}</span>
                  </button>
                ))}
              </div>
              <div className={styles.mobileSlots}>
                {SLOT_TIME_ROWS.map((row, timeIndex) => {
                  const selected =
                    !slotsLocked && isSameSlot(selection, { dayIndex: mobileDay, timeIndex });
                  return (
                    <button
                      key={row}
                      type="button"
                      className={[
                        styles.mobileSlot,
                        isLoading
                          ? styles.mobileSlotSkeleton
                          : isEmptyWeek
                            ? styles.mobileSlotUnavailable
                            : selected
                              ? styles.mobileSlotSelected
                              : styles.mobileSlotFree,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => selectSlot(mobileDay, timeIndex)}
                      disabled={slotsLocked}
                      aria-pressed={selected || undefined}
                    >
                      {isLoading ? (
                        <span className={styles.mobileSlotSkeletonBar} aria-hidden />
                      ) : (
                        <>
                          <span className={styles.mobileSlotTime}>{slotStartLabel(row)}</span>
                          <span className={styles.mobileSlotStatus}>
                            {isEmptyWeek ? 'Недоступен' : selected ? 'Выбран' : 'Свободно'}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className={styles.sidePanel}>
            <TimezoneRow className={styles.timezoneDesktop} />
            <SelectedTeacherCard teacher={teacher} duration={filters.duration} type={filters.type} />
            {isEmptyWeek || isLoading ? null : (
              <SelectionSummary selection={selection} weekOffset={weekOffset} />
            )}
            <div className={styles.actions}>
              {canConfirm ? (
                <Button fullWidth onClick={() => setConfirmOpen(true)}>
                  Перейти к подтверждению
                </Button>
              ) : null}
              <button type="button" className={styles.backTeachers} onClick={handleBack}>
                <span className={styles.backIcon}>
                  <img src={ICON_ARROW} alt="" width={17} height={17} />
                </span>
                Назад к преподавателям
              </button>
            </div>
          </aside>
        </div>
      </div>
      {confirmOpen && canConfirm ? (
        <BookingConfirmModal
          teacherName={teacher.name}
          selection={selection}
          weekOffset={weekOffset}
          duration={filters.duration}
          type={filters.type}
          missingCredits={missingCredits}
          initialView={initialView}
          onClose={closeConfirm}
          onTopUp={handleTopUp}
          onSchedule={handleSchedule}
        />
      ) : null}
    </StudentLayout>
  );
}
