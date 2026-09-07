import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import styles from './StudentDashboard.module.css';

import LOGO_COMPACT from '../../assets/icons/student/logo.svg';
import LOGO_FULL from '../../assets/icons/student/logo-full.svg';
import ICON_HOME from '../../assets/icons/student/home.svg';
import ICON_CALENDAR from '../../assets/icons/student/calendar.svg';
import ICON_PENCIL from '../../assets/icons/student/pencil.svg';
import ICON_MATERIALS from '../../assets/icons/student/materials.svg';
import ICON_WALLET from '../../assets/icons/student/wallet.svg';
import ICON_PROGRESS from '../../assets/icons/student/progress.svg';
import ICON_NOTIFICATION from '../../assets/icons/student/notification.svg';
import ICON_PERSON from '../../assets/icons/student/person.svg';
import ICON_EXIT from '../../assets/icons/student/exit.svg';
import ICON_SEARCH from '../../assets/icons/student/search.svg';
import ICON_NOTIFICATION_TOP from '../../assets/icons/student/notification-top.svg';
import ICON_CHEVRON from '../../assets/icons/student/chevron.svg';
import ICON_PERSON_SM from '../../assets/icons/student/person-sm.svg';
import ICON_BOOK from '../../assets/icons/student/book.svg';
import ICON_INFO from '../../assets/icons/student/info.svg';
import ICON_FILE from '../../assets/icons/student/file.svg';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import ICON_ARROW from '../../assets/icons/student/arrow.svg';
import ICON_PURPOSE from '../../assets/icons/student/purpose.svg';
import ICON_LESSON from '../../assets/icons/student/lesson.svg';
import ICON_MEDAL from '../../assets/icons/student/medal.svg';
import ICON_CHECK from '../../assets/icons/student/check-mark.svg';
import ICON_DOTS from '../../assets/icons/student/dots.svg';
import ICON_NOTIF_CALENDAR from '../../assets/icons/student/notif-calendar.svg';
import ICON_NOTIF_MESSAGE from '../../assets/icons/student/notif-message.svg';
import ICON_NOTIF_NOTE from '../../assets/icons/student/notif-note.svg';
import ICON_UNREAD_DOT from '../../assets/icons/student/unread-dot.svg';
import CHART_AREA from '../../assets/icons/student/chart-area.svg';
import CHART_LINE from '../../assets/icons/student/chart-line.svg';
import CHART_DOT from '../../assets/icons/student/chart-dot.svg';
import BALANCE_RING from '../../assets/icons/student/balance-ring.svg';
import AVATAR from '../../assets/images/student/avatar.png';
import TEACHER_1 from '../../assets/images/student/teacher-1.png';
import TEACHER_2 from '../../assets/images/student/teacher-2.png';

const STUDENT_LEVEL = 'B1+';

const NAV_TOP = [
  { icon: ICON_HOME, label: 'Главная', to: '/home', active: true },
  { icon: ICON_CALENDAR, label: 'Расписание', to: '/schedule', active: false },
  { icon: ICON_PENCIL, label: 'Запись', to: '/booking', active: false },
  { icon: ICON_MATERIALS, label: 'Материалы', to: '/materials', active: false },
  { icon: ICON_WALLET, label: 'Баланс', to: '/balance', active: false },
  { icon: ICON_PROGRESS, label: 'Прогресс', to: '/progress', active: false },
] as const;

type DotColor = 'green' | 'red' | 'gray';

type CalendarDay = {
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

const JULY_DOTS: Record<number, DotColor[]> = {
  1: ['green'],
  2: ['green'],
  3: ['green'],
  9: ['red', 'green'],
};

type HomeworkStatus = 'missing' | 'review' | 'done';

const HOMEWORK = [
  {
    title: 'Презентация о себе',
    status: 'missing' as HomeworkStatus,
    statusLabel: 'Не загружено',
    metaLabel: 'Срок',
    metaValue: 'до 14 июля, 18:00',
    hint: 'Запишите аудио-ответ и прикрепите файл.',
  },
  {
    title: 'Письменное задание',
    status: 'review' as HomeworkStatus,
    statusLabel: 'На проверке',
    metaLabel: 'Отправлено',
    metaValue: '29 июня, 18:25',
    hint: 'Преподаватель проверит и даст ответ.',
  },
  {
    title: 'Тест по теме урока',
    status: 'done' as HomeworkStatus,
    statusLabel: 'Проверено',
    metaLabel: 'Оценка',
    metaValue: '90%',
    hint: 'Комментарий преподавателя добавлен.',
  },
] as const;

const UPCOMING = [
  {
    teacher: 'Пётр Васильев',
    date: '2 июля',
    time: '19:00 - 20:00',
    avatar: TEACHER_1,
    badge: 'soon' as const,
    badgeLabel: 'Скоро',
  },
  {
    teacher: 'Анна Петрова',
    date: '3 июля',
    time: '19:00 - 20:00',
    avatar: TEACHER_2,
    badge: 'confirmed' as const,
    badgeLabel: 'Подтверждён',
  },
] as const;

type NotifTone = 'lesson' | 'comment' | 'homework';

const NOTIFICATIONS: {
  id: string;
  tone: NotifTone;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
  showDot?: boolean;
}[] = [
  {
    id: '1',
    tone: 'lesson',
    title: 'Урок скоро начнётся',
    desc: 'Business Negotiations начнётся сегодня в 19:00.',
    time: '16:30',
  },
  {
    id: '2',
    tone: 'comment',
    title: 'Преподаватель оставил комментарий',
    desc: 'К домашнему заданию по уроку Present Perfect добавлен комментарий.',
    time: '14:15',
    showDot: true,
  },
  {
    id: '3',
    tone: 'homework',
    title: 'Добавлено новое домашнее задание',
    desc: 'Контекст',
    time: 'Вчера, 11:20',
    unread: true,
  },
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

function buildCalendarDays(year: number, month: number, selectedDay: number): CalendarDay[] {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const dots = month === 6 ? JULY_DOTS : {};

  const days: CalendarDay[] = [];

  for (let i = 0; i < startWeekday; i += 1) {
    days.push({ label: String(prevDays - startWeekday + i + 1), outside: true });
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    days.push({
      label: String(d),
      selected: d === selectedDay,
      dots: dots[d],
    });
  }

  const remainder = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
  for (let i = 1; i <= remainder; i += 1) {
    days.push({ label: String(i), outside: true });
  }

  return days;
}

function homeworkStatusClass(status: HomeworkStatus): string {
  if (status === 'missing') return styles.hwStatusMissing;
  if (status === 'review') return styles.hwStatusReview;
  return styles.hwStatusDone;
}

function notifIcon(tone: NotifTone): string {
  if (tone === 'lesson') return ICON_NOTIF_CALENDAR;
  if (tone === 'comment') return ICON_NOTIF_MESSAGE;
  return ICON_NOTIF_NOTE;
}

function notifIconClass(tone: NotifTone): string {
  if (tone === 'lesson') return styles.notifIconLesson;
  if (tone === 'comment') return styles.notifIconComment;
  return styles.notifIconHomework;
}

function SearchField({ className }: { className?: string }) {
  return (
    <label className={[styles.search, className].filter(Boolean).join(' ')}>
      <img src={ICON_SEARCH} alt="" width={20} height={20} />
      <input type="search" placeholder="Поиск по материалам и урокам" />
    </label>
  );
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const name = session?.name || 'Иван Васильев';
  const countdown = useLessonCountdown();

  const [viewMonth, setViewMonth] = useState(6);
  const [selectedDay, setSelectedDay] = useState(1);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const calendarDays = buildCalendarDays(2025, viewMonth, selectedDay);

  useEffect(() => {
    if (!notifOpen && !userMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifOpen && notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [notifOpen, userMenuOpen]);

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
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
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="Навигация">
          <div className={styles.logoWrap}>
            <img src={LOGO_COMPACT} alt="" className={styles.logoCompact} width={38} height={26} />
            <img src={LOGO_FULL} alt="EngLab" className={styles.logoFull} width={110} height={27} />
          </div>
          <div className={styles.sidebarBody}>
            <nav className={styles.sidebarTop} aria-label="Основное меню">
              {NAV_TOP.map((item) => {
                const className = [
                  styles.sidebarItem,
                  item.active ? styles.sidebarItemActive : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <Link key={item.label} to={item.to} className={className}>
                    <span className={styles.sidebarIconWrap}>
                      <img src={item.icon} alt="" />
                    </span>
                    <span className={styles.sidebarLabel}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className={styles.sidebarBottom}>
              <button
                type="button"
                className={styles.sidebarItem}
                onClick={() => {
                  setUserMenuOpen(false);
                  setNotifOpen((open) => !open);
                }}
              >
                <span className={styles.sidebarIconWrap}>
                  <img src={ICON_NOTIFICATION} alt="" />
                </span>
                <span className={styles.sidebarLabel}>Уведомления</span>
              </button>
              <button type="button" className={styles.sidebarItem}>
                <span className={styles.sidebarIconWrap}>
                  <img src={ICON_PERSON} alt="" />
                </span>
                <span className={styles.sidebarLabel}>Профиль</span>
              </button>
              <button type="button" className={styles.sidebarItem} onClick={handleLogout}>
                <span className={styles.sidebarIconWrap}>
                  <img src={ICON_EXIT} alt="" />
                </span>
                <span className={styles.sidebarLabel}>Выход</span>
              </button>
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.headingWrap}>
              <h1 className={styles.pageTitle}>
                <span className={styles.pageTitleDesktop}>Главная</span>
                <span className={styles.pageTitleMobile}>Обзор</span>
              </h1>
              <p className={styles.pageSubtitle}>Ваше обучение</p>
            </div>
            <div className={styles.topbarActions}>
              <SearchField className={styles.searchDesktop} />
              <div className={styles.notificationWrap} ref={notifRef}>
                <button
                  type="button"
                  className={styles.notificationBtn}
                  aria-label="Уведомления"
                  aria-expanded={notifOpen}
                  onClick={() => {
                    setUserMenuOpen(false);
                    setNotifOpen((open) => !open);
                  }}
                >
                  <img src={ICON_NOTIFICATION_TOP} alt="" width={24} height={24} />
                </button>
                {notifOpen ? (
                  <div className={styles.notifPanel} role="dialog" aria-label="Уведомления">
                    <div className={styles.notifHeader}>
                      <p className={styles.notifTitle}>Уведомления</p>
                      <button type="button" className={styles.notifReadAll}>
                        Прочитать все
                      </button>
                    </div>
                    <div className={styles.notifList}>
                      {NOTIFICATIONS.map((item) => (
                        <div
                          key={item.id}
                          className={[
                            styles.notifItem,
                            item.unread ? styles.notifItemUnread : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <div className={styles.notifItemBody}>
                            <span className={`${styles.notifIcon} ${notifIconClass(item.tone)}`}>
                              <img src={notifIcon(item.tone)} alt="" />
                            </span>
                            <div className={styles.notifText}>
                              <p className={styles.notifItemTitle}>{item.title}</p>
                              <p className={styles.notifItemDesc}>{item.desc}</p>
                              <p className={styles.notifItemTime}>{item.time}</p>
                            </div>
                            {item.showDot ? (
                              <img src={ICON_UNREAD_DOT} alt="" className={styles.notifUnreadDot} />
                            ) : null}
                          </div>
                          <span className={styles.notifDots}>
                            <img src={ICON_DOTS} alt="" />
                          </span>
                        </div>
                      ))}
                    </div>
                    <button type="button" className={styles.btnSecondary}>
                      Смотреть все уведомления
                    </button>
                  </div>
                ) : null}
              </div>
              <div className={styles.userChipWrap} ref={userMenuRef}>
                <button
                  type="button"
                  className={styles.userChip}
                  aria-expanded={userMenuOpen}
                  onClick={() => {
                    setNotifOpen(false);
                    setUserMenuOpen((open) => !open);
                  }}
                >
                  <span className={styles.userChipProfile}>
                    <img src={AVATAR} alt="" className={styles.userAvatar} width={32} height={32} />
                    <span className={styles.userChipText}>
                      <span className={styles.userName}>{name}</span>
                      <span className={styles.levelBadge}>{STUDENT_LEVEL}</span>
                    </span>
                  </span>
                  <span className={styles.chevronWrap}>
                    <img src={ICON_CHEVRON} alt="" width={9} height={5} />
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.mobileAvatarBtn}
                  aria-label={name}
                  onClick={() => {
                    setNotifOpen(false);
                    setUserMenuOpen((open) => !open);
                  }}
                >
                  <img src={AVATAR} alt="" className={styles.userAvatar} width={32} height={32} />
                </button>
                {userMenuOpen ? (
                  <div className={styles.userMenu} role="menu">
                    <button type="button" className={styles.userMenuItem} role="menuitem">
                      Профиль
                      <img src={ICON_ARROW_LITE} alt="" width={24} height={24} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.userMenuItem} ${styles.userMenuItemLogout}`}
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Выйти
                      <img src={ICON_EXIT} alt="" width={20} height={20} />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <SearchField className={styles.searchMobile} />

          <div className={styles.cards}>
            <section className={`${styles.card} ${styles.nearestCard}`} aria-label="Ближайший урок">
              <div className={styles.nearestTop}>
                <h2 className={styles.cardTitle}>Ближайший урок</h2>
                <div className={styles.nearestBody}>
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
                  <div className={styles.countdownBlockWrap}>
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
              </div>
              <div className={styles.nearestActions}>
                <button type="button" className={styles.btnDisabled} disabled>
                  Войти в урок
                </button>
                <button type="button" className={styles.btnOutline}>
                  Детали урока
                </button>
              </div>
            </section>

            <section className={`${styles.card} ${styles.homeworkCard}`} aria-label="Домашние задания">
              <h2 className={styles.cardTitle}>Последние домашние задания</h2>
              <div className={styles.homeworkList}>
                {HOMEWORK.map((hw) => (
                  <button key={hw.title} type="button" className={styles.homeworkItem}>
                    <div className={styles.homeworkContent}>
                      <div className={styles.homeworkHead}>
                        <span className={styles.homeworkIcon}>
                          <img src={ICON_FILE} alt="" width={28} height={28} />
                        </span>
                        <span className={styles.homeworkTitles}>
                          <span className={styles.homeworkTitle}>{hw.title}</span>
                          <span className={`${styles.homeworkStatus} ${homeworkStatusClass(hw.status)}`}>
                            {hw.statusLabel}
                          </span>
                        </span>
                      </div>
                      <div className={styles.homeworkMeta}>
                        <p className={styles.metaText}>
                          <span className={styles.metaLabel}>{hw.metaLabel}:</span>{' '}
                          <span className={styles.metaValue}>{hw.metaValue}</span>
                        </p>
                        <p className={styles.homeworkHint}>{hw.hint}</p>
                      </div>
                    </div>
                    <img src={ICON_ARROW_LITE} alt="" width={24} height={24} />
                  </button>
                ))}
              </div>
            </section>

            <section className={`${styles.card} ${styles.calendarCard}`} aria-label="Календарь">
              <div className={styles.calendarHeader}>
                <h2 className={styles.calendarTitle}>{MONTH_NAMES[viewMonth]}</h2>
                <div className={styles.calendarNav}>
                  <button
                    type="button"
                    className={styles.calendarNavBtn}
                    aria-label="Предыдущий месяц"
                    onClick={() => {
                      setViewMonth((m) => (m === 0 ? 11 : m - 1));
                      setSelectedDay(1);
                    }}
                  >
                    <img src={ICON_ARROW} alt="" className={styles.arrowPrev} width={24} height={24} />
                  </button>
                  <button
                    type="button"
                    className={styles.calendarNavBtn}
                    aria-label="Следующий месяц"
                    onClick={() => {
                      setViewMonth((m) => (m === 11 ? 0 : m + 1));
                      setSelectedDay(1);
                    }}
                  >
                    <img src={ICON_ARROW} alt="" width={24} height={24} />
                  </button>
                </div>
              </div>
              <div className={styles.calendarBody}>
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
                      const className = [
                        styles.dayCell,
                        day.outside ? styles.dayOutside : '',
                        day.selected ? styles.daySelected : '',
                        day.dots?.length ? styles.dayWithDots : '',
                      ]
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <button
                          key={`${day.label}-${index}`}
                          type="button"
                          className={className}
                          disabled={day.outside}
                          onClick={() => {
                            if (!day.outside) setSelectedDay(Number(day.label));
                          }}
                        >
                          <span>{day.label}</span>
                          {day.dots?.length ? (
                            <span className={styles.dayDots}>
                              {day.dots.map((color, i) => (
                                <span
                                  key={`${color}-${i}`}
                                  className={`${styles.dot} ${
                                    color === 'green'
                                      ? styles.dotGreen
                                      : color === 'red'
                                        ? styles.dotRed
                                        : styles.dotGray
                                  }`}
                                />
                              ))}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.calendarLegend}>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotRed}`} />
                    Завершён
                  </span>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotGreen}`} />
                    Запланирован
                  </span>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotGray}`} />
                    Перенос
                  </span>
                </div>
              </div>
            </section>

            <section className={`${styles.card} ${styles.upcomingCard}`} aria-label="Предстоящие уроки">
              <div className={styles.upcomingTop}>
                <h2 className={styles.cardTitle}>Предстоящие уроки</h2>
                <div className={styles.upcomingList}>
                  {UPCOMING.map((lesson) => (
                    <button key={lesson.teacher} type="button" className={styles.upcomingItem}>
                      <div className={styles.upcomingMobileHead}>
                        <span className={styles.upcomingWhen}>
                          <span className={styles.metaLabel}>{lesson.date}</span>
                          <span className={styles.metaValue}>{lesson.time}</span>
                        </span>
                        <span
                          className={`${styles.upcomingBadge} ${
                            lesson.badge === 'soon'
                              ? styles.upcomingBadgeSoon
                              : styles.upcomingBadgeConfirmed
                          }`}
                        >
                          {lesson.badgeLabel}
                        </span>
                      </div>
                      <div className={styles.upcomingContent}>
                        <div className={styles.upcomingTeacher}>
                          <img
                            src={lesson.avatar}
                            alt=""
                            className={styles.upcomingAvatar}
                            width={40}
                            height={40}
                          />
                          <span className={styles.upcomingTeacherText}>
                            <span className={styles.metaLabel}>Преподаватель</span>
                            <span className={styles.metaValue}>{lesson.teacher}</span>
                          </span>
                        </div>
                        <span className={`${styles.upcomingWhen} ${styles.upcomingDesktopWhen}`}>
                          <span className={styles.metaLabel}>{lesson.date}</span>
                          <span className={styles.metaValue}>{lesson.time}</span>
                        </span>
                      </div>
                      <img
                        src={ICON_ARROW_LITE}
                        alt=""
                        width={32}
                        height={32}
                        className={styles.upcomingArrow}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className={styles.btnPrimary}>
                Записаться ещё
              </button>
            </section>

            <section className={`${styles.card} ${styles.progressCard}`} aria-label="Прогресс">
              <h2 className={styles.cardTitle}>Прогресс</h2>
              <div className={styles.progressBody}>
                <div className={styles.progressTop}>
                  <div className={styles.metaRow}>
                    <img src={ICON_PURPOSE} alt="" width={20} height={20} />
                    <p className={styles.metaText}>
                      <span className={styles.metaLabel}>Цель:</span>{' '}
                      <span className={styles.metaValue}>Разговорный английский</span>
                    </p>
                  </div>
                  <div className={styles.progressStats}>
                    <div className={styles.progressStat}>
                      <img src={ICON_LESSON} alt="" width={20} height={20} />
                      <div className={styles.progressStatText}>
                        <span className={styles.metaLabel}>Пройдено уроков</span>
                        <span className={styles.metaValue}>24</span>
                      </div>
                    </div>
                    <div className={styles.progressStat}>
                      <img src={ICON_MEDAL} alt="" width={20} height={20} />
                      <div className={styles.progressStatText}>
                        <span className={styles.metaLabel}>Текущий уровень</span>
                        <span className={styles.metaValue}>B1</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.progressChartBlock}>
                  <div className={styles.progressGoals}>
                    <p className={styles.metaText}>
                      <span className={styles.metaLabel}>Следующая цель:</span>{' '}
                      <span className={styles.metaValue}>B1+</span>
                    </p>
                    <p className={styles.metaText}>
                      <span className={styles.metaLabel}>Прогресс:</span>{' '}
                      <span className={styles.metaValue}>85%</span>
                    </p>
                  </div>
                  <div className={styles.chartWrap}>
                    <div className={styles.chartLevels}>
                      {['100%', '75%', '50%', '25%', '0%'].map((label) => (
                        <div key={label} className={styles.chartLevel}>
                          <span className={styles.chartLevelLabel}>{label}</span>
                          <span className={styles.chartLevelLine} />
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartMonths}>
                      <span className={styles.chartMonthSpacer} />
                      {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'].map((m) => (
                        <span key={m} className={styles.chartMonth}>
                          {m}
                        </span>
                      ))}
                    </div>
                    <div className={styles.chartPlot}>
                      <img src={CHART_AREA} alt="" className={styles.chartArea} />
                      <img src={CHART_LINE} alt="" className={styles.chartLine} />
                      <img src={CHART_DOT} alt="" className={styles.chartDot} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={`${styles.card} ${styles.balanceCard}`} aria-label="Баланс">
              <div className={styles.balanceTop}>
                <h2 className={styles.cardTitle}>Баланс</h2>
                <div className={styles.balanceDiagram}>
                  <div className={styles.balanceRing}>
                    <div className={styles.balanceRingTrack} aria-hidden="true">
                      <div className={styles.balanceRingArc}>
                        <img src={BALANCE_RING} alt="" className={styles.balanceRingImg} />
                      </div>
                    </div>
                    <div className={styles.balanceCenter}>
                      <span className={styles.balanceValue}>67</span>
                      <span className={styles.balanceUnit}>кредитов</span>
                    </div>
                  </div>
                  <div className={styles.infoBadge}>
                    <img src={ICON_CHECK} alt="" width={20} height={20} />
                    <span className={styles.infoBadgeText}>Хватит примерно на 5 уроков</span>
                  </div>
                </div>
              </div>
              <button type="button" className={styles.btnAccentOutline}>
                Пополнить баланс
              </button>
            </section>
          </div>
        </div>
      </div>

      <nav className={styles.bottomNav} aria-label="Мобильная навигация">
        <Link to="/home" className={`${styles.bottomNavItem} ${styles.bottomNavActive}`} aria-current="page">
          <img src={ICON_HOME} alt="" />
          <span>Главная</span>
        </Link>
        <Link to="/schedule" className={styles.bottomNavItem}>
          <img src={ICON_CALENDAR} alt="" />
          <span>Расписание</span>
        </Link>
        <button type="button" className={styles.bottomNavItem}>
          <img src={ICON_PENCIL} alt="" />
          <span>Запись</span>
        </button>
        <Link to="/materials" className={styles.bottomNavItem}>
          <img src={ICON_MATERIALS} alt="" />
          <span>Материалы</span>
        </Link>
        <button type="button" className={styles.bottomNavItem}>
          <img src={ICON_DOTS} alt="" />
          <span>Ещё</span>
        </button>
      </nav>
    </div>
  );
}
