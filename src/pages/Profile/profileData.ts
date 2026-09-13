import type { UserRole } from '../../shared/auth/mockAuth';
import STUDENT_AVATAR from '../../assets/images/student/avatar.png';
import TEACHER_AVATAR from '../../assets/images/teacher/avatar-teacher.png';
import ADMIN_AVATAR from '../../assets/images/admin/da13fe3f-3c26-4838-9f87-50e819b11e60.png';

export type ProfileData = {
  displayName: string;
  bio: string;
  name: string;
  email: string;
  timezone: string;
  timezoneLabel: string;
  password: string;
  goal: string;
  level: string;
  lessonTime: string;
  language: string;
  emailNotify: boolean;
  pushNotify: boolean;
  securityNote: string;
  googleEmail: string;
};

export const DEFAULT_PROFILE: ProfileData = {
  displayName: 'Иван Васильев',
  bio: 'Изучаю английский для общения и профессионального роста',
  name: 'Анна Петрова',
  email: 'annapetrova@example.ru',
  timezone: 'UTC +3, Москва',
  timezoneLabel: 'Европа/Москва (UTC +3, Москва)',
  password: 'EngLab123!',
  goal: 'Улучшить разговорные навыки и уверенность в общении',
  level: 'B1 - средний',
  lessonTime: 'Вечер, 18:00 - 21:00',
  language: 'Русский',
  emailNotify: true,
  pushNotify: true,
  securityNote: 'Пароль обновлён 15.06.2026',
  googleEmail: 'annapetrova@example.ru',
};

const TEACHER_PROFILE: ProfileData = {
  displayName: 'Пётр Васильев',
  bio: 'Преподаю английский для бизнеса и уверенной разговорной практики',
  name: 'Пётр Васильев',
  email: 'ivanpetrov@example.ru',
  timezone: 'UTC +3, Москва',
  timezoneLabel: 'Европа/Москва (UTC +3, Москва)',
  password: 'EngLab123!',
  goal: 'Помогать студентам уверенно говорить на английском',
  level: 'C1 (Продвинутый)',
  lessonTime: 'Вечер, 18:00 - 21:00',
  language: 'Русский',
  emailNotify: true,
  pushNotify: true,
  securityNote: 'Пароль обновлён 15.06.2026',
  googleEmail: 'ivanpetrov@example.ru',
};

const ADMIN_PROFILE: ProfileData = {
  displayName: 'Пётр Васильев',
  bio: 'Администрирую платформу EngLab и слежу за качеством обучения',
  name: 'Пётр Васильев',
  email: 'admin@example.ru',
  timezone: 'UTC +3, Москва',
  timezoneLabel: 'Европа/Москва (UTC +3, Москва)',
  password: 'EngLab123!',
  goal: 'Держать сервис стабильным и удобным для студентов и преподавателей',
  level: 'C1 (Продвинутый)',
  lessonTime: 'День, 12:00 - 18:00',
  language: 'Русский',
  emailNotify: true,
  pushNotify: true,
  securityNote: 'Пароль обновлён 15.06.2026',
  googleEmail: 'admin@example.ru',
};

export const PROFILE_BY_ROLE: Record<UserRole, ProfileData> = {
  student: DEFAULT_PROFILE,
  teacher: TEACHER_PROFILE,
  admin: ADMIN_PROFILE,
};

export const PROFILE_AVATAR_BY_ROLE: Record<UserRole, string> = {
  student: STUDENT_AVATAR,
  teacher: TEACHER_AVATAR,
  admin: ADMIN_AVATAR,
};

export const EDIT_PRESET: ProfileData = {
  ...DEFAULT_PROFILE,
  name: 'Виолетта Васильева',
};

export const TIMEZONES = [
  'UTC +3, Москва',
  'UTC +2, Берлин',
  'UTC +1, Лондон',
  'UTC +0, Лиссабон',
  'UTC +4, Дубай',
  'UTC +5, Ташкент',
  'UTC +6, Алматы',
  'UTC +7, Бангкок',
  'UTC +8, Пекин',
  'UTC +9, Токио',
  'UTC -5, Нью-Йорк',
  'UTC -8, Лос-Анджелес',
];

export const LEVELS = [
  'Все уровни',
  'Не знаю уровень',
  'A1 (начальный)',
  'A2 (Элементарный)',
  'B1 (Ниже среднего)',
  'B1 - средний',
  'B1+ (Средний+)',
  'B2 (Выше среднего)',
  'C1 (Продвинутый)',
  'C2 (Свободное владение)',
];

export const LESSON_TIMES: { value: string; hint?: string }[] = [
  { value: 'Любое время' },
  { value: 'Утро', hint: '(6:00 - 12:00)' },
  { value: 'День', hint: '(12:00 - 17:00)' },
  { value: 'Вечер', hint: '(17:00 - 22:00)' },
];

export const TIMEZONE_LABELS: Record<string, string> = {
  'UTC +3, Москва': 'Европа/Москва (UTC +3, Москва)',
  'UTC +2, Берлин': 'Европа/Берлин (UTC +2, Берлин)',
  'UTC +1, Лондон': 'Европа/Лондон (UTC +1, Лондон)',
  'UTC +0, Лиссабон': 'Европа/Лиссабон (UTC +0, Лиссабон)',
  'UTC +4, Дубай': 'Азия/Дубай (UTC +4, Дубай)',
  'UTC +5, Ташкент': 'Азия/Ташкент (UTC +5, Ташкент)',
  'UTC +6, Алматы': 'Азия/Алматы (UTC +6, Алматы)',
  'UTC +7, Бангкок': 'Азия/Бангкок (UTC +7, Бангкок)',
  'UTC +8, Пекин': 'Азия/Пекин (UTC +8, Пекин)',
  'UTC +9, Токио': 'Азия/Токио (UTC +9, Токио)',
  'UTC -5, Нью-Йорк': 'Америка/Нью-Йорк (UTC -5, Нью-Йорк)',
  'UTC -8, Лос-Анджелес': 'Америка/Лос-Анджелес (UTC -8, Лос-Анджелес)',
};

export function lessonTimeValue(option: { value: string; hint?: string }): string {
  return option.hint ? `${option.value} ${option.hint}` : option.value;
}

export function isLessonTimeSelected(current: string, option: { value: string; hint?: string }): boolean {
  if (!option.hint) return current === option.value;
  return current === lessonTimeValue(option) || current.startsWith(`${option.value},`) || current.startsWith(`${option.value} `);
}
