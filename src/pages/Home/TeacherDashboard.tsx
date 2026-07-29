import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { clearSession } from '../../shared/auth/mockAuth';
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
import iconPerson from '../../assets/icons/teacher/person.svg';
import iconBookSm from '../../assets/icons/teacher/book-sm.svg';
import iconInfo from '../../assets/icons/teacher/info.svg';
import iconArrowLite from '../../assets/icons/teacher/arrow-lite.svg';
import iconArrow from '../../assets/icons/teacher/arrow.svg';
import iconLesson from '../../assets/icons/teacher/lesson.svg';
import iconCloseCircle from '../../assets/icons/teacher/close-circle.svg';
import iconLoad from '../../assets/icons/teacher/load.svg';
import iconStar from '../../assets/icons/teacher/star.svg';
import iconDots from '../../assets/icons/teacher/dots.svg';
import iconPencilNav from '../../assets/icons/teacher/pencil-nav.svg';
import iconEmptySlot from '../../assets/icons/teacher/empty-slot.svg';
import iconEmptyHomework from '../../assets/icons/teacher/empty-homework.svg';
import iconEmptyCoffee from '../../assets/icons/teacher/empty-coffee.svg';
import iconEmptySlotSm from '../../assets/icons/teacher/empty-slot-sm.svg';
import imgAvatarTeacher from '../../assets/images/teacher/avatar-teacher.png';
import imgAvatarMobile from '../../assets/images/teacher/avatar-mobile.png';
import imgChartArea from '../../assets/images/teacher/chart-line.svg';
import imgChartLine from '../../assets/images/teacher/chart-area.svg';
import imgChartDot from '../../assets/images/teacher/chart-dot.svg';
import logoEnglab from '../../assets/images/logo-englab.svg';
import {
  getTeacherDashboardData,
  type ActionItemData,
  type LessonItemData,
  type LessonStatus,
} from './teacherDashboardData';
import styles from './TeacherDashboard.module.css';

const th = t.teacherHome;

type DotColor = 'green' | 'red' | 'gray';

type CalendarDay = {
  label: string;
  outside?: boolean;
  selected?: boolean;
  dots?: DotColor[];
};

const WEEKDAYS = [
  th.weekdays.mon,
  th.weekdays.tue,
  th.weekdays.wed,
  th.weekdays.thu,
  th.weekdays.fri,
  th.weekdays.sat,
  th.weekdays.sun,
];

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

/** Demo lesson markers for July (matches Figma). */
const JULY_DOTS: Record<number, DotColor[]> = {
  1: ['green'],
  2: ['green'],
  3: ['green'],
  9: ['red', 'green'],
  15: ['gray'],
  18: ['green'],
  22: ['red', 'green'],
  25: ['green'],
  28: ['gray'],
  30: ['green'],
};

function getMonthDots(_year: number, month: number, hasPlans: boolean): Record<number, DotColor[]> {
  if (!hasPlans) return {};
  if (month === 6) return JULY_DOTS;
  return {
    3: ['green'],
    8: ['red', 'green'],
    14: ['green'],
    21: ['gray'],
    27: ['green'],
  };
}

function toMondayIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

function buildCalendarDays(
  year: number,
  month: number,
  selectedDay: number | null,
  hasPlans: boolean,
): CalendarDay[] {
  const firstWeekday = toMondayIndex(new Date(year, month, 1).getDay());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const dots = getMonthDots(year, month, hasPlans);
  const days: CalendarDay[] = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    days.push({ label: String(daysInPrevMonth - i), outside: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      label: String(day),
      selected: selectedDay === day,
      dots: dots[day],
    });
  }

  let nextDay = 1;
  while (days.length % 7 !== 0) {
    days.push({ label: String(nextDay), outside: true });
    nextDay += 1;
  }

  return days;
}

function CardEmptyState({
  icon,
  iconSize = 70,
  iconBox = 100,
  title,
  description,
}: {
  icon: string;
  iconSize?: number;
  iconBox?: number;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIconWrap} style={{ width: iconBox, height: iconBox }}>
        <img src={icon} alt="" width={iconSize} height={iconSize} />
      </div>
      <div className={styles.emptyText}>
        <p className={styles.emptyTitle}>{title}</p>
        <p className={styles.emptyDesc}>{description}</p>
      </div>
    </div>
  );
}

type LessonItem = LessonItemData;

const STATUS_CLASS: Record<LessonStatus, string> = {
  soon: styles.badgeSoon,
  confirmed: styles.badgeConfirmed,
  cancelled: styles.badgeCancelled,
};

const STATUS_LABEL: Record<LessonStatus, string> = {
  soon: th.statusSoon,
  confirmed: th.statusConfirmed,
  cancelled: th.statusCancelled,
};

/** Lesson starts today at 19:00 local time (matches mock copy). */
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

function pad2(value: number): string {
  return String(value).padStart(2, '0');
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
    { icon: iconHome, iconSize: 28, label: th.navHome, to: '/home', active: true },
    { icon: iconCalendar, iconSize: 22.4, label: th.navCalendar, to: '/schedule', active: false },
    { icon: iconBook, iconSize: 22.4, label: th.navBook, to: '/lesson', active: false },
    { icon: iconStudents, iconSize: 22.4, label: th.navStudents, to: '/students', active: false },
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
            return (
              <Link
                key={item.label}
                to={item.to}
                className={className}
                aria-current={item.active ? 'page' : undefined}
                aria-label={item.label}
              >
                <IconImg src={item.icon} box={32} size={item.iconSize} />
                {expanded ? <span className={styles.navLabel}>{item.label}</span> : null}
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

function SearchField({ placeholder, className }: { placeholder: string; className?: string }) {
  return (
    <label className={[styles.search, className].filter(Boolean).join(' ')}>
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
        <h1 className={styles.title}>{th.title}</h1>
        <p className={styles.subtitle}>{th.subtitle}</p>
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

function NearestLessonCard({ hasLesson }: { hasLesson: boolean }) {
  const countdown = useLessonCountdown();
  const units = [
    {
      value: pad2(countdown.days),
      label: pluralRu(countdown.days, 'день', 'дня', 'дней'),
    },
    {
      value: pad2(countdown.hours),
      label: pluralRu(countdown.hours, 'час', 'часа', 'часов'),
    },
    {
      value: pad2(countdown.minutes),
      label: pluralRu(countdown.minutes, 'минута', 'минуты', 'минут'),
    },
    {
      value: pad2(countdown.seconds),
      label: pluralRu(countdown.seconds, 'секунда', 'секунды', 'секунд'),
    },
  ];

  if (!hasLesson) {
    return (
      <section className={`${styles.card} ${styles.nearestCard}`}>
        <h2 className={styles.cardTitle}>{th.nearestLesson}</h2>
        <CardEmptyState
          icon={iconEmptySlot}
          title={th.emptyNearestTitle}
          description={th.emptyNearestDesc}
        />
        <Link to="/schedule" className={styles.viewScheduleBtn}>
          {th.viewSchedule}
        </Link>
      </section>
    );
  }

  return (
    <section className={`${styles.card} ${styles.nearestCard}`}>
      <div className={styles.nearestTop}>
        <h2 className={styles.cardTitle}>{th.nearestLesson}</h2>
        <div className={styles.nearestBody}>
          <div className={styles.metaLines}>
            <p className={styles.lessonTime}>{countdown.lessonTimeLabel}</p>
            <div className={styles.metaRows}>
              <div className={styles.metaRow}>
                <IconImg src={iconPerson} box={20} size={14} />
                <div className={styles.metaText}>
                  <span className={styles.metaLabel}>
                    <span className={styles.hideMobile}>{th.studentLabel}:</span>
                    <span className={styles.showMobile}>{th.studentLabel}</span>
                  </span>
                  <span className={`${styles.metaValue} ${styles.hideMobile}`}>{th.studentDesktop}</span>
                  <span className={`${styles.metaValue} ${styles.showMobile}`}>{th.studentMobile}</span>
                </div>
              </div>
              <div className={styles.metaRow}>
                <IconImg src={iconBookSm} box={20} size={14} />
                <div className={styles.metaText}>
                  <span className={styles.metaLabel}>
                    <span className={styles.hideMobile}>{th.topicLabel}:</span>
                    <span className={styles.showMobile}>{th.topicLabel}</span>
                  </span>
                  <span className={styles.metaValue}>{th.topicValue}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.countdownBlockWrap}>
            <div className={styles.infoBadge}>
              <IconImg src={iconInfo} box={20} size={14} />
              <span className={styles.infoBadgeText}>{th.accessInfoDesktop}</span>
            </div>
            <div
              className={styles.countdown}
              aria-label={units.map((u) => `${u.value} ${u.label}`).join(', ')}
            >
              {units.map((item, index) => (
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
      </div>
      <div className={styles.nearestActions}>
        <button type="button" className={styles.joinBtn} disabled>
          {th.joinLesson}
        </button>
        <Link to="/lesson" className={styles.detailsBtn}>
          {th.lessonDetails}
        </Link>
      </div>
    </section>
  );
}

function ActionsCard({ actions }: { actions: ActionItemData[] }) {
  if (actions.length === 0) {
    return (
      <section className={`${styles.card} ${styles.actionsCard}`}>
        <h2 className={styles.cardTitle}>{th.upcomingActions}</h2>
        <CardEmptyState
          icon={iconEmptyHomework}
          title={th.emptyActionsTitle}
          description={th.emptyActionsDesc}
        />
      </section>
    );
  }

  return (
    <section className={`${styles.card} ${styles.actionsCard}`}>
      <h2 className={styles.cardTitle}>{th.upcomingActions}</h2>
      <ul className={styles.actionList}>
        {actions.map((action, index) => (
          <li key={`${action.title}-${index}`}>
            <button type="button" className={styles.actionRow}>
              <span className={styles.actionIcon}>
                <IconImg src={action.icon} box={40} size={28} />
              </span>
              <span className={styles.actionText}>
                <span className={styles.actionTitle}>{action.title}</span>
                <span className={styles.actionMeta}>{action.meta}</span>
              </span>
              <IconImg src={iconArrowLite} box={24} size={16.8} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CalendarCard({ hasPlans }: { hasPlans: boolean }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const days = buildCalendarDays(viewYear, viewMonth, selectedDay, hasPlans);

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
    if (next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth()) {
      setSelectedDay(today.getDate());
    } else {
      setSelectedDay(1);
    }
  };

  return (
    <section className={`${styles.card} ${styles.calendarCard}`}>
      <div className={styles.calendarHeader}>
        <h2 className={styles.calendarTitle}>{MONTH_NAMES[viewMonth]}</h2>
        <div className={styles.calendarNav}>
          <button
            type="button"
            className={styles.calendarNavBtn}
            aria-label="Предыдущий месяц"
            onClick={() => shiftMonth(-1)}
          >
            <span className={styles.arrowPrev}>
              <IconImg src={iconArrow} box={24} size={16.8} />
            </span>
          </button>
          <button
            type="button"
            className={styles.calendarNavBtn}
            aria-label="Следующий месяц"
            onClick={() => shiftMonth(1)}
          >
            <IconImg src={iconArrow} box={24} size={16.8} />
          </button>
        </div>
      </div>
      <div className={styles.calendarBody}>
        <div className={styles.calendarGrid}>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((day) => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>
          <div className={styles.daysGrid}>
            {days.map((day, index) => (
              <button
                key={`${viewYear}-${viewMonth}-${day.label}-${index}`}
                type="button"
                className={[
                  styles.dayCell,
                  day.outside ? styles.dayOutside : '',
                  !day.outside && day.selected ? styles.daySelected : '',
                  day.dots?.length ? styles.dayWithDots : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={day.outside}
                onClick={() => {
                  if (!day.outside) setSelectedDay(Number(day.label));
                }}
              >
                <span>{day.label}</span>
                {day.dots?.length ? (
                  <span className={styles.dayDots}>
                    {day.dots.map((color) => (
                      <span
                        key={color}
                        className={[
                          styles.dot,
                          color === 'green' ? styles.dotGreen : '',
                          color === 'red' ? styles.dotRed : '',
                          color === 'gray' ? styles.dotGray : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      />
                    ))}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
        {hasPlans ? (
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.dotRed}`} />
              {th.legendCompleted}
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.dotGreen}`} />
              {th.legendPlanned}
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.dotGray}`} />
              {th.legendMoved}
            </span>
          </div>
        ) : (
          <div className={styles.calendarEmpty}>
            <IconImg src={iconEmptySlotSm} box={20} size={14} />
            <div className={styles.calendarEmptyText}>
              <p className={styles.calendarEmptyLine1}>{th.emptyCalendarLine1}</p>
              <p className={styles.calendarEmptyLine2}>{th.emptyCalendarLine2}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function LessonCard({ lesson }: { lesson: LessonItem }) {
  return (
    <article className={styles.lessonItem}>
      <div className={styles.lessonItemHeader}>
        <div className={styles.lessonItemTime}>
          {lesson.date ? <span className={styles.lessonItemDate}>{lesson.date}</span> : null}
          <span>{lesson.time}</span>
        </div>
        <span className={`${styles.badge} ${STATUS_CLASS[lesson.status]}`}>{STATUS_LABEL[lesson.status]}</span>
      </div>
      <div className={styles.lessonItemBody}>
        <img src={lesson.avatar} alt="" className={styles.lessonAvatar} width={40} height={40} />
        <div className={styles.lessonItemText}>
          <span className={styles.lessonStudent}>{lesson.student}</span>
          <span className={styles.lessonTopic}>{lesson.topic}</span>
        </div>
      </div>
    </article>
  );
}

function LessonsTodayCard({
  lessons,
  mobileLessons,
}: {
  lessons: LessonItem[];
  mobileLessons: LessonItem[];
}) {
  const isEmpty = lessons.length === 0 && mobileLessons.length === 0;

  if (isEmpty) {
    return (
      <section className={`${styles.card} ${styles.lessonsCard}`}>
        <h2 className={styles.cardTitle}>{th.lessonsToday}</h2>
        <CardEmptyState
          icon={iconEmptyCoffee}
          iconSize={56}
          iconBox={80}
          title={th.emptyLessonsTitle}
          description={th.emptyLessonsDesc}
        />
        <Link to="/schedule" className={styles.scheduleBtn}>
          {th.goToSchedule}
        </Link>
      </section>
    );
  }

  return (
    <section className={`${styles.card} ${styles.lessonsCard}`}>
      <div className={styles.lessonsContent}>
        <h2 className={styles.cardTitle}>{th.lessonsToday}</h2>
        <div className={`${styles.lessonsList} ${styles.hideMobile}`}>
          {lessons.map((lesson, index) => (
            <LessonCard key={`d-${lesson.status}-${index}`} lesson={lesson} />
          ))}
        </div>
        <div className={`${styles.lessonsList} ${styles.showMobileBlock}`}>
          {mobileLessons.map((lesson, index) => (
            <LessonCard key={`m-${lesson.status}-${index}`} lesson={lesson} />
          ))}
        </div>
      </div>
      <Link to="/schedule" className={styles.scheduleBtn}>
        {th.goToSchedule}
      </Link>
    </section>
  );
}

function StatsCard({ hasChartHistory }: { hasChartHistory: boolean }) {
  const kpis = [
    { icon: iconLesson, label: th.kpiLessons, value: th.kpiLessonsValue },
    { icon: iconCloseCircle, label: th.kpiCancelled, value: th.kpiCancelledValue },
    { icon: iconLoad, label: th.kpiLoad, value: th.kpiLoadValue },
    { icon: iconStar, label: th.kpiRating, value: th.kpiRatingValue },
  ];

  return (
    <section className={`${styles.card} ${styles.statsCard}`}>
      <h2 className={styles.cardTitle}>{th.statsTitle}</h2>
      <div className={styles.statsBody}>
        <div className={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <div key={kpi.label} className={styles.kpiCard}>
              <IconImg src={kpi.icon} box={20} size={14} />
              <div className={styles.kpiText}>
                <span className={styles.kpiLabel}>{kpi.label}</span>
                <span className={styles.kpiValue}>{kpi.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.chartSection}>
          <p className={styles.chartTitle}>
            <span className={styles.chartTitleLabel}>{th.chartTitle}:</span>
            <span className={styles.chartTitleValue}>{th.chartValue}</span>
          </p>
          <div className={styles.chartWrap}>
            <div className={styles.chartLevels}>
              {['100%', '75%', '50%', '25%', '0%'].map((level) => (
                <div key={level} className={styles.chartLevel}>
                  <span>{level}</span>
                  <span className={styles.chartLine} />
                </div>
              ))}
            </div>
            <div className={styles.chartPlot}>
              {hasChartHistory ? (
                <>
                  <img src={imgChartArea} alt="" className={styles.chartArea} />
                  <img src={imgChartLine} alt="" className={styles.chartStroke} />
                  <img src={imgChartDot} alt="" className={styles.chartDot} width={8} height={8} />
                </>
              ) : (
                <p className={styles.chartEmptyMessage}>{th.emptyChartMessage}</p>
              )}
            </div>
            <div className={`${styles.chartAxis} ${styles.hideMobile}`}>
              <span />
              <span>{th.chartMonths.jan}</span>
              <span>{th.chartMonths.feb}</span>
              <span>{th.chartMonths.mar}</span>
              <span>{th.chartMonths.apr}</span>
              <span>{th.chartMonths.may}</span>
              <span>{th.chartMonths.jun}</span>
            </div>
            <div className={`${styles.chartAxis} ${styles.showMobileFlex}`}>
              <span />
              <span>{th.chartDays.d1}</span>
              <span>{th.chartDays.d8}</span>
              <span>{th.chartDays.d15}</span>
              <span>{th.chartDays.d22}</span>
              <span>{th.chartDays.d29}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileBottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="Мобильная навигация">
      <Link to="/home" className={`${styles.bottomNavItem} ${styles.bottomNavActive}`} aria-current="page">
        <IconImg src={iconHome} box={32} size={22.4} />
        <span>{th.mobileNavHome}</span>
      </Link>
      <Link to="/schedule" className={styles.bottomNavItem}>
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

export function TeacherDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const dashboardData = useMemo(
    () => getTeacherDashboardData(searchParams.get('empty') === '1'),
    [searchParams],
  );

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.dashboard}>
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
          <SearchField placeholder={th.searchMobile} className={styles.searchMobile} />
          <div className={styles.grid}>
            <NearestLessonCard hasLesson={dashboardData.nearestLesson} />
            <ActionsCard actions={dashboardData.actions} />
            <CalendarCard hasPlans={dashboardData.calendarHasPlans} />
            <LessonsTodayCard
              lessons={dashboardData.todayLessons}
              mobileLessons={dashboardData.todayLessonsMobile}
            />
            <StatsCard hasChartHistory={dashboardData.statsHasChartHistory} />
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default TeacherDashboard;
