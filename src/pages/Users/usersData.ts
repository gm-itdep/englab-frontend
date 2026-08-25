export type UserRole = 'student' | 'teacher' | 'admin';

export type UserStatus = 'active';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
  lastLoginAt: string;
};

export const ROLE_FILTER_ALL = 'Все роли';

export const ROLE_FILTER_OPTIONS = [
  ROLE_FILTER_ALL,
  'Студенты',
  'Преподаватели',
  'Администраторы',
] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Студент',
  teacher: 'Преподаватель',
  admin: 'Администратор',
};

export const EDIT_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'student', label: ROLE_LABELS.student },
  { value: 'teacher', label: ROLE_LABELS.teacher },
  { value: 'admin', label: ROLE_LABELS.admin },
];

export function splitUserName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Активен',
};

export const PAGE_SIZE = 8;

const DATE = '15 февраля 2026';

const ROLE_CYCLE: UserRole[] = [
  'student',
  'admin',
  'teacher',
  'student',
  'student',
  'student',
  'student',
  'student',
];

export function getAdminUsers(): AdminUser[] {
  return Array.from({ length: 43 }, (_, index) => ({
    id: `user-${index + 1}`,
    name: `Иван Петров ${index + 1}`,
    email: `user${index + 1}@example.ru`,
    role: ROLE_CYCLE[index % ROLE_CYCLE.length],
    status: 'active',
    registeredAt: DATE,
    lastLoginAt: DATE,
  }));
}

export function roleMatchesFilter(role: UserRole, filter: string): boolean {
  if (!filter || filter === ROLE_FILTER_ALL) return true;
  if (filter === 'Студенты') return role === 'student';
  if (filter === 'Преподаватели') return role === 'teacher';
  if (filter === 'Администраторы') return role === 'admin';
  return true;
}
