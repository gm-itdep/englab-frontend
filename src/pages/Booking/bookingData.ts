import PHOTO_PETR from '../../assets/images/student/teachers/petr.png';
import PHOTO_ANNA from '../../assets/images/student/teachers/anna.png';
import PHOTO_IVAN from '../../assets/images/student/teachers/ivan.png';
import PHOTO_MARIA from '../../assets/images/student/teachers/maria.png';

export type BookingTeacher = {
  id: string;
  name: string;
  photo: string;
  rating: string;
  language: string;
  accent: string;
  tags: string[];
  levels: string;
  nextSlot: string;
  freeSlots: string;
  bio: string;
  matched?: boolean;
  favorite?: boolean;
};

export const BOOKING_TEACHERS: BookingTeacher[] = [
  {
    id: 'petr',
    name: 'Пётр Васильев',
    photo: PHOTO_PETR,
    rating: '4,9',
    language: 'Английский',
    accent: 'Британский акцент',
    tags: ['Business', 'Speaking', 'Interview'],
    levels: 'A2-C1',
    nextSlot: 'Сегодня, 19:00',
    freeSlots: '3 окна',
    bio: 'Практический подход и фокус на уверенном общении в бизнесе.',
    matched: true,
    favorite: true,
  },
  {
    id: 'anna',
    name: 'Анна Петрова',
    photo: PHOTO_ANNA,
    rating: '4,9',
    language: 'Английский',
    accent: 'Британский акцент',
    tags: ['Business', 'Speaking', 'Interview'],
    levels: 'A2-C1',
    nextSlot: 'Сегодня, 19:00',
    freeSlots: '3 окна',
    bio: 'Практический подход и фокус на уверенном общении в бизнесе.',
  },
  {
    id: 'ivan',
    name: 'Кожевников Иван',
    photo: PHOTO_IVAN,
    rating: '4,9',
    language: 'Английский',
    accent: 'Британский акцент',
    tags: ['Business', 'Speaking', 'Interview'],
    levels: 'A2-C1',
    nextSlot: 'Сегодня, 19:00',
    freeSlots: '3 окна',
    bio: 'Практический подход и фокус на уверенном общении в бизнесе.',
  },
  {
    id: 'maria',
    name: 'Мария Каримова',
    photo: PHOTO_MARIA,
    rating: '4,9',
    language: 'Английский',
    accent: 'Британский акцент',
    tags: ['Business', 'Speaking', 'Interview'],
    levels: 'A2-C1',
    nextSlot: 'Сегодня, 19:00',
    freeSlots: '3 окна',
    bio: 'Практический подход и фокус на уверенном общении в бизнесе.',
  },
];

export const FOUND_COUNT = 12;

export const GOAL_OPTIONS = [
  'Разговорная практика',
  'Деловое общение',
  'Путешествия',
  'Подготовка к собеседованию',
  'Подготовка к экзамену',
] as const;

export const LEVEL_OPTIONS = ['A1', 'A2', 'B1', 'B1+', 'B2', 'C1', 'C2'] as const;

export const TIME_OPTIONS = ['Утро, 06:00–12:00', 'День, 12:00–17:00', 'Вечер, 17:00–22:00'] as const;

export const SPEC_OPTIONS = ['Business', 'Speaking', 'Interview'] as const;

export type FilterKey = 'goal' | 'level' | 'time' | 'spec';

export type FilterValues = Record<FilterKey, string>;

export const DEFAULT_FILTERS: FilterValues = {
  goal: '',
  level: '',
  time: '',
  spec: '',
};

export const SLOT_DAY_OPTIONS = [
  'Все цели',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
] as const;

export const SLOT_STATUS_OPTIONS = [
  'Все слоты',
  'Свободные',
  'Недоступные',
  'Выбранный слот',
] as const;

export const SLOT_DURATION_OPTIONS = [
  'Любая длительность',
  '30 минут',
  '45 минут',
  '60 минут',
  '90 минут',
] as const;

export const SLOT_TYPE_OPTIONS = ['Все типы', 'Индивидуально', 'Групповой', 'Разговорный клуб'] as const;

export const SLOT_TIME_ROWS = [
  '06:00 - 07:00',
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
] as const;

export type SlotFilterKey = 'days' | 'status' | 'duration' | 'type';

export type SlotFilterValues = Record<SlotFilterKey, string>;

export const DEFAULT_SLOT_FILTERS: SlotFilterValues = {
  days: SLOT_DAY_OPTIONS[0],
  status: SLOT_STATUS_OPTIONS[0],
  duration: '60 минут',
  type: 'Индивидуально',
};

export const SLOT_FILTER_TRIGGER_LABELS: Partial<Record<string, string>> = {
  [SLOT_DAY_OPTIONS[0]]: 'Все',
};

export const SLOT_COST_CREDITS = 20;
export const SLOT_COST_LABEL = `${SLOT_COST_CREDITS} кредитов`;
export const STUDENT_BALANCE_CREDITS = 67;
export const STUDENT_BALANCE_LOW_CREDITS = 7;
