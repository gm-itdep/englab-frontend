export type SlotStatus = 'free' | 'busy' | 'completed' | 'unavailable';

export type ScheduleSlot = {
  status: SlotStatus;
  studentName?: string;
};

export type SlotSelection = {
  dayIndex: number;
  timeIndex: number;
};

export type WeekDay = {
  weekday: string;
  date: string;
  dayNum: string;
  fullDate: Date;
};

/** Monday of the mock week from Figma (29 June 2026). */
export const BASE_WEEK_START = new Date(2026, 5, 29);

/** Matches Figma — Wed 1 July, 10:00–11:00 free (default selection). */
export const INITIAL_SELECTION: SlotSelection = {
  dayIndex: 2,
  timeIndex: 4,
};

const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;
const WEEKDAYS_FULL = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
] as const;
const MONTHS_GENITIVE = [
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

const free = (): ScheduleSlot => ({ status: 'free' });
const completed = (): ScheduleSlot => ({ status: 'completed' });
const unavailable = (): ScheduleSlot => ({ status: 'unavailable' });
const busy = (studentName = 'Анна'): ScheduleSlot => ({ status: 'busy', studentName });

/**
 * Week grid from Figma 58:13103 — [dayIndex][timeIndex].
 * Days: Mon–Sun; times: 06:00–15:00 (9 rows).
 * Conflict (red icon) is a click state on busy slots, not a permanent cell.
 */
export const WEEK_SLOTS: ScheduleSlot[][] = [
  // Mon 29
  [
    completed(),
    completed(),
    unavailable(),
    completed(),
    completed(),
    completed(),
    completed(),
    completed(),
    completed(),
  ],
  // Tue 30
  [
    unavailable(),
    unavailable(),
    completed(),
    completed(),
    completed(),
    completed(),
    completed(),
    unavailable(),
    unavailable(),
  ],
  // Wed 1
  [busy(), free(), free(), free(), free(), busy(), busy(), busy(), free()],
  // Thu 2
  [busy(), busy(), free(), free(), free(), free(), free(), free(), free()],
  // Fri 3
  [busy(), free(), free(), free(), free(), free(), busy(), free(), busy()],
  // Sat 4
  [free(), free(), free(), free(), free(), free(), free(), free(), free()],
  // Sun 5
  [free(), free(), free(), free(), free(), free(), free(), free(), free()],
];

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDayMonth(date: Date): string {
  return `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]}`;
}

export function getWeekStart(weekOffset: number): Date {
  return addDays(BASE_WEEK_START, weekOffset * 7);
}

export function buildWeekDays(weekOffset: number): WeekDay[] {
  const start = getWeekStart(weekOffset);
  return WEEKDAYS_SHORT.map((weekday, index) => {
    const fullDate = addDays(start, index);
    return {
      weekday,
      date: formatDayMonth(fullDate),
      dayNum: String(fullDate.getDate()),
      fullDate,
    };
  });
}

/** e.g. "29 июня - 5 июля 2026" */
export function formatWeekRange(weekOffset: number): string {
  const days = buildWeekDays(weekOffset);
  const start = days[0].fullDate;
  const end = days[6].fullDate;
  const year = end.getFullYear();

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${MONTHS_GENITIVE[end.getMonth()]} ${year}`;
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `${formatDayMonth(start)} - ${formatDayMonth(end)} ${year}`;
  }

  return `${formatDayMonth(start)} ${start.getFullYear()} - ${formatDayMonth(end)} ${year}`;
}

/** e.g. "Среда, 1 июля" */
export function formatSelectionDate(weekOffset: number, dayIndex: number): string {
  const day = buildWeekDays(weekOffset)[dayIndex];
  if (!day) return '—';
  return `${WEEKDAYS_FULL[dayIndex]}, ${formatDayMonth(day.fullDate)}`;
}

export function getSlot(dayIndex: number, timeIndex: number, weekOffset = 0): ScheduleSlot {
  if (weekOffset !== 0) {
    return free();
  }
  return WEEK_SLOTS[dayIndex]?.[timeIndex] ?? free();
}

export function slotStartLabel(timeRange: string): string {
  return timeRange.split(' - ')[0]?.trim() ?? timeRange;
}

export function isSameSlot(
  a: SlotSelection | null,
  b: Pick<SlotSelection, 'dayIndex' | 'timeIndex'>,
): boolean {
  return a !== null && a.dayIndex === b.dayIndex && a.timeIndex === b.timeIndex;
}
