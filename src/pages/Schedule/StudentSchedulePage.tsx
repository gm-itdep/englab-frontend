import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { StudentLayout } from '../Home/StudentLayout';
import ICON_ARROW from '../../assets/icons/student/arrow.svg';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import ICON_BOOK from '../../assets/icons/student/book.svg';
import ICON_EMPTY_HOMEWORK from '../../assets/icons/student/empty-homework.svg';
import ICON_EMPTY_SLOT from '../../assets/icons/student/empty-slot.svg';
import ICON_FILTER from '../../assets/icons/student/filter.svg';
import ICON_INFO from '../../assets/icons/student/info.svg';
import ICON_PERSON_SM from '../../assets/icons/student/person-sm.svg';
import ICON_TIME from '../../assets/icons/student/time.svg';
import styles from './StudentSchedulePage.module.css';

type CalView = 'month' | 'week';
type LessonFilter = 'all' | 'upcoming' | 'past' | 'cancelled';
type DotColor = 'green' | 'red' | 'gray';

type CalendarDay = {
  date: Date;
  label: string;
  outside?: boolean;
  selected?: boolean;
  dots?: DotColor[];
};

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;
const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const;

const FILTERS: { id: LessonFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'upcoming', label: 'Предстоящие' },
  { id: 'past', label: 'Прошедшие' },
  { id: 'cancelled', label: 'Отменённые' },
];

const JULY_2026_DOTS: Record<number, DotColor[]> = {
  7: ['green'],
  8: ['red', 'green'],
  9: ['red', 'green', 'gray'],
};

const UPCOMING_LESSONS = [
  {
    date: '6 июля, понедельник',
    time: '14:00 - 15:00',
    teacher: 'Маргарита Васильева',
    topic: 'Разговорный для путешествий',
  },
  {
    date: '7 июля, вторник',
    time: '16:00 - 17:00',
    teacher: 'Маргарита Васильева',
    topic: 'Разговорный для путешествий',
  },
  {
    date: '8 июля, среда',
    time: '21:00 - 22:00',
    teacher: 'Маргарита Васильева',
    topic: 'Разговорный для путешествий',
  },
] as const;

type WeekStatus = 'done' | 'scheduled' | 'soon' | 'cancelled';

type WeekEvent = {
  dateKey: string;
  hour: number;
  teacher: string;
  status: WeekStatus;
  desktop?: boolean;
  mobile?: boolean;
};

const MONTH_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const;

const WEEK_HOURS = [8, 10, 12, 14, 16, 18] as const;
const WEEK_SLOT_PX = 45;
const WEEK_GRID_START_HOUR = 8;

function weekEventTop(hour: number): number {
  return (hour - WEEK_GRID_START_HOUR + 1) * WEEK_SLOT_PX;
}

const WEEK_STATUS_LABEL: Record<WeekStatus, string> = {
  done: 'Пройден',
  scheduled: 'Назначен',
  soon: 'Скоро',
  cancelled: 'Отменён',
};

const WEEK_EVENTS: WeekEvent[] = [
  { dateKey: '2026-06-29', hour: 16, teacher: 'Васильева М.', status: 'cancelled', desktop: true },
  { dateKey: '2026-07-01', hour: 9, teacher: 'Васильева М.', status: 'done', desktop: true },
  { dateKey: '2026-07-01', hour: 11, teacher: 'Васильева М.', status: 'soon', desktop: true },
  { dateKey: '2026-07-03', hour: 14, teacher: 'Васильева М.', status: 'scheduled', desktop: true },
  { dateKey: '2026-07-01', hour: 16, teacher: 'Васильева М.', status: 'done', mobile: true },
  { dateKey: '2026-07-01', hour: 16, teacher: 'Васильева М.', status: 'scheduled', mobile: true },
  { dateKey: '2026-07-01', hour: 16, teacher: 'Васильева М.', status: 'soon', mobile: true },
  { dateKey: '2026-07-01', hour: 16, teacher: 'Васильева М.', status: 'cancelled', mobile: true },
  { dateKey: '2026-07-01', hour: 16, teacher: 'Васильева М.', status: 'done', mobile: true },
];

const LESSON_START_HOUR = 19;
const LESSON_START_MINUTE = 0;

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getLessonStartDate(now = new Date()): Date {
  const start = new Date(now);
  start.setHours(LESSON_START_HOUR, LESSON_START_MINUTE, 0, 0);
  if (start.getTime() <= now.getTime()) {
    start.setDate(start.getDate() + 1);
  }
  return start;
}

function formatLessonTimeLabel(now = new Date()): string {
  const start = getLessonStartDate(now);
  const isToday =
    start.getFullYear() === now.getFullYear() &&
    start.getMonth() === now.getMonth() &&
    start.getDate() === now.getDate();
  const dayLabel = isToday ? 'Сегодня' : 'Завтра';
  return `${dayLabel}, 19:00 - 20:00`;
}

function getCountdownParts(now = new Date()): CountdownParts {
  const diffMs = Math.max(0, getLessonStartDate(now).getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function pluralRu(value: number, one: string, few: string, many: string): string {
  const abs = Math.abs(value) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

function useLessonCountdown(): CountdownParts & { lessonTimeLabel: string } {
  const [parts, setParts] = useState(() => getCountdownParts());
  const [lessonTimeLabel, setLessonTimeLabel] = useState(() => formatLessonTimeLabel());

  useEffect(() => {
    const tick = () => {
      setParts(getCountdownParts());
      setLessonTimeLabel(formatLessonTimeLabel());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return { ...parts, lessonTimeLabel };
}

function matchesFilter(color: DotColor, filter: LessonFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'upcoming') return color === 'green';
  if (filter === 'past') return color === 'red';
  return color === 'gray';
}

function filterDots(dots: DotColor[] | undefined, filter: LessonFilter): DotColor[] | undefined {
  if (!dots?.length) return undefined;
  const next = dots.filter((dot) => matchesFilter(dot, filter));
  return next.length ? next : undefined;
}

function matchesWeekFilter(status: WeekStatus, filter: LessonFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'upcoming') return status === 'scheduled' || status === 'soon';
  if (filter === 'past') return status === 'done';
  return status === 'cancelled';
}

function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function startOfWeek(date: Date): Date {
  const next = new Date(date);
  const weekday = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - weekday);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function formatWeekRange(start: Date): string {
  const end = addDays(start, 6);
  return `${start.getDate()} ${MONTH_GENITIVE[start.getMonth()]} - ${end.getDate()} ${MONTH_GENITIVE[end.getMonth()]} ${end.getFullYear()}`;
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

function formatWeekDayDate(date: Date, compact = false): string {
  if (compact) return String(date.getDate());
  return `${date.getDate()} ${MONTH_GENITIVE[date.getMonth()]}`;
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function weekEventClass(status: WeekStatus): string {
  if (status === 'done') return styles.weekEventDone;
  if (status === 'scheduled') return styles.weekEventScheduled;
  if (status === 'soon') return styles.weekEventSoon;
  return styles.weekEventCancelled;
}

function WeekStatusMark({ status }: { status: WeekStatus }) {
  return (
    <span className={styles.weekEventStatus}>
      <span className={styles.weekStatusDot} />
      {WEEK_STATUS_LABEL[status]}
    </span>
  );
}

function WeekEmptyState({ className, to }: { className?: string; to: string }) {
  return (
    <div className={[styles.weekEmpty, className].filter(Boolean).join(' ')}>
      <div className={styles.weekEmptyContent}>
        <div className={styles.weekEmptyIcon}>
          <img src={ICON_EMPTY_HOMEWORK} alt="" width={56} height={56} />
        </div>
        <div className={styles.emptyText}>
          <p className={styles.emptyTitle}>Здесь пока пусто</p>
          <p className={styles.emptyDesc}>
            После записи на урок ваши занятия появятся в расписании.
          </p>
        </div>
      </div>
      <Link to={to} className={`${styles.btnPrimary} ${styles.weekEmptyBtn}`}>
        Забронировать урок
      </Link>
    </div>
  );
}

function buildCalendarDays(
  year: number,
  month: number,
  selected: Date,
  hasPlans: boolean,
  filter: LessonFilter,
): CalendarDay[] {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const dotsMap = hasPlans && year === 2026 && month === 6 ? JULY_2026_DOTS : {};

  const days: CalendarDay[] = [];

  for (let i = 0; i < startWeekday; i += 1) {
    const day = prevDays - startWeekday + i + 1;
    days.push({
      date: new Date(year, month - 1, day),
      label: String(day),
      outside: true,
    });
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = new Date(year, month, d);
    days.push({
      date,
      label: String(d),
      selected:
        date.getFullYear() === selected.getFullYear() &&
        date.getMonth() === selected.getMonth() &&
        date.getDate() === selected.getDate(),
      dots: filterDots(dotsMap[d], filter),
    });
  }

  const remainder = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
  for (let i = 1; i <= remainder; i += 1) {
    days.push({
      date: new Date(year, month + 1, i),
      label: String(i),
      outside: true,
    });
  }

  return days;
}

function dotClass(color: DotColor): string {
  if (color === 'green') return styles.dotGreen;
  if (color === 'red') return styles.dotRed;
  return styles.dotGray;
}

export function StudentSchedulePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEmpty = searchParams.get('empty') === '1';
  const role = searchParams.get('role');
  const bookingTo = role ? `/booking?role=${role}` : '/booking';
  const countdown = useLessonCountdown();

  const [view, setView] = useState<CalView>('month');
  const [filter, setFilter] = useState<LessonFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cursor, setCursor] = useState(() => new Date(2026, 6, 1));
  const [selected, setSelected] = useState(() => new Date(2026, 6, 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const weekStart = startOfWeek(selected);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const weekKeys = new Set(weekDays.map(dateKey));
  const calendarDays = buildCalendarDays(year, month, selected, !isEmpty, filter);
  const weekEvents = isEmpty
    ? []
    : WEEK_EVENTS.filter(
        (event) =>
          event.desktop &&
          weekKeys.has(event.dateKey) &&
          matchesWeekFilter(event.status, filter),
      );
  const selectedKey = dateKey(selected);
  const mobileWeekEvents = isEmpty
    ? []
    : (WEEK_EVENTS.filter(
        (event) => event.mobile && event.dateKey === selectedKey && matchesWeekFilter(event.status, filter),
      ).length
        ? WEEK_EVENTS.filter(
            (event) =>
              event.mobile && event.dateKey === selectedKey && matchesWeekFilter(event.status, filter),
          )
        : WEEK_EVENTS.filter(
            (event) =>
              event.desktop && event.dateKey === selectedKey && matchesWeekFilter(event.status, filter),
          ));

  const shiftCursor = (delta: number) => {
    setCursor((current) => {
      const next = new Date(current);
      if (view === 'week') {
        next.setDate(next.getDate() + delta * 7);
      } else {
        next.setMonth(next.getMonth() + delta);
      }
      return next;
    });
    if (view === 'week') {
      setSelected((current) => {
        const next = new Date(current);
        next.setDate(next.getDate() + delta * 7);
        return next;
      });
    }
  };

  const countdownUnits = [
    { value: String(countdown.days), label: pluralRu(countdown.days, 'день', 'дня', 'дней') },
    { value: String(countdown.hours), label: pluralRu(countdown.hours, 'час', 'часа', 'часов') },
    {
      value: String(countdown.minutes),
      label: pluralRu(countdown.minutes, 'минута', 'минуты', 'минут'),
    },
    {
      value: String(countdown.seconds),
      label: pluralRu(countdown.seconds, 'секунда', 'секунды', 'секунд'),
    },
  ];

  return (
    <StudentLayout title="Расписание" subtitle="План занятий" activeNav="schedule">
      <div className={styles.pageBody}>
      {isEmpty ? null : (
        <section className={styles.upcomingSection} aria-label="Предстоящие уроки">
          <h2 className={styles.upcomingTitle}>Предстоящие уроки</h2>
          <div className={styles.upcomingGrid}>
            {UPCOMING_LESSONS.map((lesson) => (
              <article key={lesson.date} className={styles.upcomingLesson}>
                <div className={styles.upcomingLessonBody}>
                  <p className={styles.upcomingDate}>{lesson.date}</p>
                  <div className={styles.upcomingMeta}>
                    <div className={styles.upcomingMetaRow}>
                      <span className={styles.upcomingMetaIcon}>
                        <img src={ICON_TIME} alt="" width={14} height={14} />
                      </span>
                      <p className={styles.upcomingMetaText}>
                        <span className={styles.upcomingMetaLabel}>Время:</span>
                        <span className={styles.upcomingMetaTime}>{lesson.time}</span>
                      </p>
                    </div>
                    <div className={styles.upcomingMetaRow}>
                      <span className={styles.upcomingMetaIcon}>
                        <img src={ICON_PERSON_SM} alt="" width={14} height={14} />
                      </span>
                      <p className={styles.upcomingMetaText}>
                        <span className={styles.upcomingMetaLabel}>Преподаватель:</span>
                        <span className={styles.upcomingMetaValue}>{lesson.teacher}</span>
                      </p>
                    </div>
                    <div className={styles.upcomingMetaRow}>
                      <span className={styles.upcomingMetaIcon}>
                        <img src={ICON_BOOK} alt="" width={14} height={14} />
                      </span>
                      <p className={styles.upcomingMetaText}>
                        <span className={styles.upcomingMetaLabel}>Тема:</span>
                        <span className={styles.upcomingMetaValue}>{lesson.topic}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <button type="button" className={styles.btnOutline}>
                  Отменить урок
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
      <div className={styles.calendarColumn}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarTop}>
              <div className={styles.switcher} role="tablist" aria-label="Вид календаря">
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === 'month'}
                  className={[
                    styles.switcherItem,
                    view === 'month' ? styles.switcherItemActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setView('month')}
                >
                  Месяц
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === 'week'}
                  className={[
                    styles.switcherItem,
                    view === 'week' ? styles.switcherItemActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    setView('week');
                    setCursor(selected);
                  }}
                >
                  Неделя
                </button>
              </div>
              <div
                className={[
                  styles.switcher,
                  styles.filterSwitcher,
                  filtersOpen ? styles.filterSwitcherOpen : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="tablist"
                aria-label="Фильтр уроков"
              >
                {FILTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === item.id}
                    className={[
                      styles.switcherItem,
                      filter === item.id ? styles.switcherItemActive : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.filterBtn}
                aria-label="Фильтры"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
              >
                <img src={ICON_FILTER} alt="" width={17} height={17} />
              </button>
            </div>
            <Link to={bookingTo} className={styles.bookBtn}>
              Записаться
            </Link>
          </div>

          <section className={styles.calendarCard} aria-label="Календарь занятий">
            <div className={styles.calendarHeader}>
              <h2 className={styles.calendarTitle}>
                {view === 'week' ? formatWeekRange(weekStart) : `${MONTH_NAMES[month]} ${year}`}
              </h2>
              <div className={styles.calendarNav}>
                <button
                  type="button"
                  className={styles.calendarNavBtn}
                  aria-label={view === 'week' ? 'Предыдущая неделя' : 'Предыдущий месяц'}
                  onClick={() => shiftCursor(-1)}
                >
                  <img src={ICON_ARROW} alt="" className={styles.arrowPrev} />
                </button>
                <button
                  type="button"
                  className={styles.calendarNavBtn}
                  aria-label={view === 'week' ? 'Следующая неделя' : 'Следующий месяц'}
                  onClick={() => shiftCursor(1)}
                >
                  <img src={ICON_ARROW} alt="" />
                </button>
              </div>
            </div>

            {view === 'week' ? (
              <div className={styles.weekCalendar}>
                <div className={styles.weekHeader}>
                  <div aria-hidden className={styles.weekHeaderGutter} />
                  <div className={styles.weekHeaderDays}>
                    {weekDays.map((day, index) => {
                      const selectedDay = isSameDay(day, selected);
                      return (
                        <button
                          key={dateKey(day)}
                          type="button"
                          className={[
                            styles.weekDayHead,
                            selectedDay ? styles.weekDayHeadSelected : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => {
                            setSelected(day);
                            setCursor(day);
                          }}
                        >
                          <span className={styles.weekDayName}>{WEEKDAYS[index]}</span>
                          <span className={styles.weekDayDate}>{formatWeekDayDate(day)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.weekBody}>
                  <div className={styles.weekHours}>
                    {WEEK_HOURS.map((hour) => (
                      <div key={hour} className={styles.weekHourLabel}>
                        {formatHour(hour)}
                      </div>
                    ))}
                  </div>
                  <div className={styles.weekCols}>
                    {weekDays.map((day) => {
                      const key = dateKey(day);
                      const dayEvents = weekEvents.filter((event) => event.dateKey === key);
                      return (
                        <div key={key} className={styles.weekCol}>
                          {Array.from({ length: WEEK_HOURS.length * 2 }, (_, slot) => (
                            <div key={slot} className={styles.weekSlot} />
                          ))}
                          {dayEvents.map((event, eventIndex) => (
                            <button
                              key={`${event.dateKey}-${event.hour}-${event.status}-${eventIndex}`}
                              type="button"
                              className={[styles.weekEvent, weekEventClass(event.status)].join(' ')}
                              style={{ top: weekEventTop(event.hour) }}
                            >
                              <span className={styles.weekEventMeta}>
                                <span className={styles.weekEventTime}>{formatHour(event.hour)}</span>
                                <span className={styles.weekEventTeacher}>{event.teacher}</span>
                              </span>
                              <WeekStatusMark status={event.status} />
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  {isEmpty ? (
                    <WeekEmptyState className={styles.weekEmptyDesktop} to={bookingTo} />
                  ) : null}
                </div>

                <div className={styles.weekMobileList}>
                  <div className={styles.weekMobileDayRow}>
                    {weekDays.map((day, index) => {
                      const selectedDay = isSameDay(day, selected);
                      return (
                        <button
                          key={`mobile-${dateKey(day)}`}
                          type="button"
                          className={[
                            styles.weekDayHead,
                            selectedDay ? styles.weekDayHeadSelected : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => {
                            setSelected(day);
                            setCursor(day);
                          }}
                        >
                          <span className={styles.weekDayName}>{WEEKDAYS[index]}</span>
                          <span className={styles.weekDayDate}>{formatWeekDayDate(day, true)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className={styles.weekMobileLessons}>
                    {isEmpty ? (
                      <WeekEmptyState className={styles.weekEmptyMobile} to={bookingTo} />
                    ) : null}
                    {mobileWeekEvents.map((event, eventIndex) => (
                      <button
                        key={`${event.dateKey}-${event.status}-${eventIndex}`}
                        type="button"
                        className={[styles.weekMobileCard, weekEventClass(event.status)].join(' ')}
                      >
                        <span className={styles.weekMobileCardBody}>
                          <span className={styles.weekMobileCardTop}>
                            <span className={styles.weekEventTime}>{formatHour(event.hour)}</span>
                            <span className={styles.weekEventTeacher}>{event.teacher}</span>
                          </span>
                          <WeekStatusMark status={event.status} />
                        </span>
                        <img
                          src={ICON_ARROW_LITE}
                          alt=""
                          width={24}
                          height={24}
                          className={styles.weekMobileCardArrow}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.calendarGrid}>
                  <div className={styles.weekdayRow}>
                    {WEEKDAYS.map((day) => (
                      <div key={day} className={styles.weekdayCell}>
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className={styles.daysGrid}>
                    {calendarDays.map((day, index) => {
                      const visibleDots = day.dots?.slice(0, 2) ?? [];
                      const extra = (day.dots?.length ?? 0) - visibleDots.length;
                      const className = [
                        styles.dayCell,
                        day.outside ? styles.dayOutside : '',
                        day.selected ? styles.daySelected : '',
                        visibleDots.length ? styles.dayWithDots : '',
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <button
                          key={`${day.date.toISOString()}-${index}`}
                          type="button"
                          className={className}
                          disabled={day.outside}
                          onClick={() => {
                            if (day.outside) return;
                            setSelected(day.date);
                            setCursor(day.date);
                          }}
                        >
                          <span>{day.label}</span>
                          {visibleDots.length ? (
                            <span className={styles.dayDots}>
                              {visibleDots.map((color, dotIndex) => (
                                <span
                                  key={`${color}-${dotIndex}`}
                                  className={`${styles.dot} ${dotClass(color)}`}
                                />
                              ))}
                              {extra > 0 ? <span className={styles.dotExtra}>+{extra}</span> : null}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.legend}>
                  <span className={`${styles.legendItem} ${styles.legendCompleted}`}>
                    <span className={`${styles.dot} ${styles.dotRed}`} />
                    Завершён
                  </span>
                  <span className={`${styles.legendItem} ${styles.legendPlanned}`}>
                    <span className={`${styles.dot} ${styles.dotGreen}`} />
                    Запланирован
                  </span>
                  <span className={`${styles.legendItem} ${styles.legendCancelled}`}>
                    <span className={`${styles.dot} ${styles.dotGray}`} />
                    <span className={styles.legendCancelledDesktop}>Отменён</span>
                    <span className={styles.legendCancelledMobile}>Перенос</span>
                  </span>
                </div>
              </>
            )}
          </section>
        </div>

        <aside className={styles.sidebarColumn}>
          <div className={styles.timezoneRow}>
            <div className={styles.timezoneInfo}>
              <span className={styles.timezoneIcon}>
                <img src={ICON_TIME} alt="" width={17} height={17} />
              </span>
              <p className={styles.timezoneLabel}>UTC +3, Москва</p>
            </div>
            <button type="button" className={styles.timezoneBtn}>
              Изменить
            </button>
          </div>

          <section
            className={[styles.lessonCard, isEmpty ? styles.lessonCardEmpty : '']
              .filter(Boolean)
              .join(' ')}
            aria-label="Ближайший урок"
          >
            <h2 className={styles.lessonTitle}>Ближайший урок</h2>
            {isEmpty ? (
              <>
                <div className={styles.emptyState}>
                  <div className={styles.emptyIconWrap}>
                    <img src={ICON_EMPTY_SLOT} alt="" width={56} height={56} />
                  </div>
                  <div className={styles.emptyText}>
                    <p className={styles.emptyTitle}>У вас пока нет забронированных уроков</p>
                    <p className={styles.emptyDesc}>
                      Забронируйте первый урок, чтобы начать своё обучение.
                    </p>
                  </div>
                </div>
                <Link to={bookingTo} className={styles.btnPrimary}>
                  Забронировать урок
                </Link>
              </>
            ) : (
              <>
                <div className={styles.lessonTop}>
                  <div className={styles.lessonBody}>
                    <p className={styles.lessonTime}>{countdown.lessonTimeLabel}</p>
                    <div className={styles.metaLines}>
                      <div className={styles.metaRow}>
                        <img src={ICON_PERSON_SM} alt="" width={20} height={20} />
                        <p className={styles.metaText}>
                          <span className={styles.metaLabel}>Преподаватель:</span>{' '}
                          <span className={styles.metaValue}>Маргарита Васильева</span>
                        </p>
                      </div>
                      <div className={styles.metaRow}>
                        <img src={ICON_BOOK} alt="" width={20} height={20} />
                        <p className={styles.metaText}>
                          <span className={styles.metaLabel}>Тема:</span>{' '}
                          <span className={styles.metaValue}>Разговорный для путешествий</span>
                        </p>
                      </div>
                    </div>
                    <div className={styles.infoBadge}>
                      <img src={ICON_INFO} alt="" width={20} height={20} />
                      <span className={styles.infoBadgeText}>
                        Вход станет доступен за 10 минут до начала
                      </span>
                    </div>
                    <div className={styles.countdown} aria-live="polite">
                      {countdownUnits.map((item, index) => (
                        <div key={`${item.label}-${index}`} className={styles.countdownUnit}>
                          {index > 0 ? <span className={styles.countdownSep}>:</span> : null}
                          <div className={styles.countdownBlock}>
                            <span className={styles.countdownValue}>{item.value}</span>
                            <span className={styles.countdownLabel}>{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.lessonActions}>
                  <button type="button" className={styles.btnDisabled} disabled>
                    Войти в урок
                  </button>
                  <button
                    type="button"
                    className={styles.btnOutline}
                    onClick={() => navigate(role ? `/lesson?role=${role}` : '/lesson')}
                  >
                    Детали урока
                  </button>
                </div>
              </>
            )}
          </section>
        </aside>
      </div>
    </StudentLayout>
  );
}
