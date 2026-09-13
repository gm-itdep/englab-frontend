import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { StudentLayout } from './StudentLayout';
import styles from './StudentDashboard.module.css';

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
import ICON_EMPTY_SLOT from '../../assets/icons/student/empty-slot.svg';
import ICON_EMPTY_HOMEWORK from '../../assets/icons/student/empty-homework.svg';
import ICON_EMPTY_LESSON from '../../assets/icons/student/empty-lesson.svg';
import ICON_EMPTY_SLOT_SM from '../../assets/icons/student/empty-slot-sm.svg';
import ICON_ATTENTION from '../../assets/icons/student/attention.svg';
import CHART_AREA from '../../assets/icons/student/chart-area.svg';
import CHART_LINE from '../../assets/icons/student/chart-line.svg';
import CHART_DOT from '../../assets/icons/student/chart-dot.svg';
import BALANCE_RING from '../../assets/icons/student/balance-ring.svg';
import BALANCE_RING_EMPTY from '../../assets/icons/student/balance-ring-empty.svg';
import TEACHER_1 from '../../assets/images/student/teacher-1.png';
import TEACHER_2 from '../../assets/images/student/teacher-2.png';

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

function buildCalendarDays(
  year: number,
  month: number,
  selectedDay: number,
  hasPlans = true,
): CalendarDay[] {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const dots = hasPlans && month === 6 ? JULY_DOTS : {};

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

function CardEmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: ReactNode;
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIconWrap}>
        <img src={icon} alt="" width={56} height={56} />
      </div>
      <div className={styles.emptyText}>
        <p className={styles.emptyTitle}>{title}</p>
        <p className={styles.emptyDesc}>{description}</p>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const countdown = useLessonCountdown();
  const isEmpty = searchParams.get('empty') === '1';
  const role = searchParams.get('role');
  const topupTo = role ? `/balance/topup?role=${role}` : '/balance/topup';
  const bookingTo = role ? `/booking?role=${role}` : '/booking';
  const materialsTo = role ? `/materials?role=${role}` : '/materials';

  const [viewMonth, setViewMonth] = useState(6);
  const [selectedDay, setSelectedDay] = useState(1);

  const calendarDays = buildCalendarDays(2025, viewMonth, selectedDay, !isEmpty);

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
    <StudentLayout
      title="Главная"
      titleMobile="Обзор"
      subtitle="Ваше обучение"
      activeNav="home"
    >
          <div className={styles.cards}>
            <section
              className={`${styles.card} ${styles.nearestCard} ${isEmpty ? styles.nearestCardEmpty : ''}`}
              aria-label="Ближайший урок"
            >
              {isEmpty ? (
                <>
                  <h2 className={styles.cardTitle}>Ближайший урок</h2>
                  <CardEmptyState
                    icon={ICON_EMPTY_SLOT}
                    title="У вас пока нет забронированных уроков"
                    description="Забронируйте первый урок, чтобы начать своё обучение."
                  />
                  <Link to={bookingTo} className={styles.btnPrimary}>
                    Забронировать урок
                  </Link>
                </>
              ) : (
                <>
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

            <section className={`${styles.card} ${styles.homeworkCard}`} aria-label="Домашние задания">
              <h2 className={styles.cardTitle}>Последние домашние задания</h2>
              {isEmpty ? (
                <CardEmptyState
                  icon={ICON_EMPTY_HOMEWORK}
                  title="Активных заданий нет"
                  description={
                    <>
                      <span className={styles.emptyDescDesktop}>
                        После урока преподаватель добавит домашнее задание, материалы и срок сдачи.
                      </span>
                      <span className={styles.emptyDescMobile}>
                        Отличный день для подготовки материалов и проверки ДЗ.
                      </span>
                    </>
                  }
                />
              ) : (
              <div className={styles.homeworkList}>
                {HOMEWORK.map((hw) => (
                  <Link key={hw.title} to={materialsTo} className={styles.homeworkItem}>
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
                  </Link>
                ))}
              </div>
              )}
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
                {isEmpty ? (
                  <div className={styles.calendarEmpty}>
                    <span className={styles.calendarEmptyIcon}>
                      <img src={ICON_EMPTY_SLOT_SM} alt="" width={14} height={14} />
                    </span>
                    <div className={styles.calendarEmptyText}>
                      <p className={styles.calendarEmptyLine1}>Планов пока нет</p>
                      <p className={styles.calendarEmptyLine2}>
                        Запланированные занятия появятся в расписании
                      </p>
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            </section>

            <section
              className={`${styles.card} ${styles.upcomingCard} ${isEmpty ? styles.upcomingCardEmpty : ''}`}
              aria-label="Предстоящие уроки"
            >
              <div className={styles.upcomingTop}>
                <h2 className={styles.cardTitle}>
                  {isEmpty ? (
                    <>
                      <span className={styles.upcomingTitleDesktop}>Предстоящие уроки</span>
                      <span className={styles.upcomingTitleMobile}>Уроки сегодня</span>
                    </>
                  ) : (
                    'Предстоящие уроки'
                  )}
                </h2>
                {isEmpty ? (
                  <CardEmptyState
                    icon={ICON_EMPTY_LESSON}
                    title="Здесь будут ваши предстоящие уроки"
                    description="После бронирования занятия появятся в этом разделе."
                  />
                ) : (
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
                )}
              </div>
              <Link to={bookingTo} className={styles.btnPrimary}>
                Записаться ещё
              </Link>
            </section>

            <section
              className={`${styles.card} ${styles.progressCard} ${isEmpty ? styles.progressCardEmpty : ''}`}
              aria-label="Прогресс"
            >
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
                  {isEmpty ? null : (
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
                  )}
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
                      {isEmpty ? (
                        <p className={styles.chartEmptyMessage}>
                          История обучения появится здесь после первого урока
                        </p>
                      ) : (
                        <>
                          <img src={CHART_AREA} alt="" className={styles.chartArea} />
                          <img src={CHART_LINE} alt="" className={styles.chartLine} />
                          <img src={CHART_DOT} alt="" className={styles.chartDot} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {isEmpty ? (
                <button type="button" className={styles.btnOutline}>
                  Перейти к бронированию
                </button>
              ) : null}
            </section>

            <section
              className={`${styles.card} ${styles.balanceCard} ${isEmpty ? styles.balanceCardEmpty : ''}`}
              aria-label="Баланс"
            >
              <div className={styles.balanceTop}>
                <h2 className={styles.cardTitle}>Баланс</h2>
                <div className={styles.balanceDiagram}>
                  <div className={styles.balanceRing}>
                    <div className={styles.balanceRingTrack} aria-hidden="true">
                      <div className={styles.balanceRingArc}>
                        <img
                          src={isEmpty ? BALANCE_RING_EMPTY : BALANCE_RING}
                          alt=""
                          className={styles.balanceRingImg}
                        />
                      </div>
                    </div>
                    <div className={styles.balanceCenter}>
                      <span className={styles.balanceValue}>{isEmpty ? '0' : '67'}</span>
                      <span className={styles.balanceUnit}>кредитов</span>
                    </div>
                  </div>
                  {isEmpty ? (
                    <div className={`${styles.infoBadge} ${styles.infoBadgeError}`}>
                      <img src={ICON_ATTENTION} alt="" width={20} height={20} />
                      <span className={styles.infoBadgeText}>Баланс пуст</span>
                    </div>
                  ) : (
                    <div className={styles.infoBadge}>
                      <img src={ICON_CHECK} alt="" width={20} height={20} />
                      <span className={styles.infoBadgeText}>Хватит примерно на 5 уроков</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className={isEmpty ? styles.btnErrorOutline : styles.btnAccentOutline}
                onClick={() => navigate(topupTo)}
              >
                Пополнить баланс
              </button>
            </section>
          </div>
    </StudentLayout>
  );
}
