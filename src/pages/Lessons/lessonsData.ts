export type LessonStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type AdminLesson = {
  id: string;
  studentName: string;
  studentEmail: string;
  teacherName: string;
  teacherEmail: string;
  date: string;
  time: string;
  status: LessonStatus;
};

export const STATUS_FILTER_ALL = 'Все статусы';

export const STATUS_FILTER_OPTIONS = [
  STATUS_FILTER_ALL,
  'Запланирован',
  'Завершён',
  'Отменён',
  'Неявка студента',
] as const;

export const PERIOD_FILTER_ALL = 'Все периоды';

export const PERIOD_FILTER_OPTIONS = [
  PERIOD_FILTER_ALL,
  'Сегодня',
  'За неделю',
  'За месяц',
  'За 3 месяца',
  'За 6 месяцев',
  'За год',
] as const;

export const STATUS_LABELS: Record<LessonStatus, string> = {
  scheduled: 'Запланирован',
  completed: 'Завершён',
  cancelled: 'Отменён',
  no_show: 'Неявка студента',
};

export const PAGE_SIZE = 8;

const STATUS_CYCLE: LessonStatus[] = [
  'scheduled',
  'completed',
  'cancelled',
  'no_show',
  'scheduled',
  'scheduled',
  'completed',
  'cancelled',
];

export function getAdminLessons(): AdminLesson[] {
  return Array.from({ length: 43 }, (_, index) => ({
    id: `lesson-${index + 1}`,
    studentName: `Иван Петров ${index + 1}`,
    studentEmail: `student${index + 1}@example.ru`,
    teacherName: `Анна Смирнова ${index + 1}`,
    teacherEmail: `teacher${index + 1}@example.ru`,
    date: '03 июля 2026',
    time: '14:00',
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  }));
}

export function statusMatchesFilter(status: LessonStatus, filter: string): boolean {
  if (!filter || filter === STATUS_FILTER_ALL) return true;
  return STATUS_LABELS[status] === filter;
}

export function lessonMatchesSearch(lesson: AdminLesson, query: string): boolean {
  if (!query) return true;
  const haystack = [
    lesson.studentName,
    lesson.studentEmail,
    lesson.teacherName,
    lesson.teacherEmail,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

const PERIOD_RESULT_LIMITS: Record<string, number> = {
  Сегодня: 2,
  'За неделю': 5,
  'За месяц': 10,
  'За 3 месяца': 16,
  'За 6 месяцев': 24,
  'За год': 32,
};

export function applyPeriodFilter<T>(items: T[], filter: string): T[] {
  if (!filter || filter === PERIOD_FILTER_ALL) return items;
  const limit = PERIOD_RESULT_LIMITS[filter];
  if (limit == null) return items;
  return items.slice(0, limit);
}
