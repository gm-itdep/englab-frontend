export const TYPE_ALL = 'Все события';
export const PERIOD_ALL = 'Все время';

export const TYPE_OPTIONS = [
  TYPE_ALL,
  'Уроки',
  'Комментарии',
  'Домашние задания',
  'Баланс',
  'Отмены',
] as const;

export const PERIOD_OPTIONS = [PERIOD_ALL, 'Сегодня', 'Вчера', 'Ранее'] as const;

export type NotifKind = 'lesson' | 'comment' | 'homework' | 'balance' | 'cancelled' | 'reschedule';
export type NotifPeriod = 'today' | 'yesterday' | 'earlier';
export type NotifTone = 'green' | 'info' | 'warning' | 'error';

export type NotificationItem = {
  id: string;
  kind: NotifKind;
  period: NotifPeriod;
  tone: NotifTone;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
};

export const TYPE_TO_KIND: Record<string, NotifKind | null> = {
  [TYPE_ALL]: null,
  Уроки: 'lesson',
  Комментарии: 'comment',
  'Домашние задания': 'homework',
  Баланс: 'balance',
  Отмены: 'cancelled',
};

export const PERIOD_TO_KEY: Record<string, NotifPeriod | null> = {
  [PERIOD_ALL]: null,
  Сегодня: 'today',
  Вчера: 'yesterday',
  Ранее: 'earlier',
};

const STUDENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    kind: 'lesson',
    period: 'today',
    tone: 'green',
    title: 'Урок скоро начнётся',
    desc: 'Business Negotiations начнётся сегодня в 19:00.',
    time: '16:30',
    unread: true,
  },
  {
    id: '2',
    kind: 'comment',
    period: 'today',
    tone: 'info',
    title: 'Преподаватель оставил комментарий',
    desc: 'К домашнему заданию по уроку Present Perfect добавлен комментарий.',
    time: '14:15',
    unread: true,
  },
  {
    id: '3',
    kind: 'homework',
    period: 'yesterday',
    tone: 'warning',
    title: 'Добавлено новое домашнее задание',
    desc: 'По уроку Conditionals доступно новое задание.',
    time: 'Вчера, 11:20',
    unread: true,
  },
  {
    id: '4',
    kind: 'balance',
    period: 'yesterday',
    tone: 'green',
    title: 'Баланс пополнен',
    desc: 'На счёт зачислено 8 кредитов.',
    time: 'Вчера, 09:05',
    unread: false,
  },
  {
    id: '5',
    kind: 'cancelled',
    period: 'earlier',
    tone: 'error',
    title: 'Урок отменён',
    desc: 'Урок Speaking Club на 12 июля отменён преподавателем.',
    time: '10 июля, 17:45',
    unread: false,
  },
  {
    id: '6',
    kind: 'reschedule',
    period: 'earlier',
    tone: 'warning',
    title: 'Время урока изменилось',
    desc: 'Урок Business English перенесён на 18:30.',
    time: '8 июля, 10:10',
    unread: false,
  },
];

const TEACHER_NOTIFICATIONS: NotificationItem[] = [
  {
    ...STUDENT_NOTIFICATIONS[0],
    title: 'Урок скоро начнётся',
    desc: 'Business Negotiations с Иваном Васильевым начнётся сегодня в 19:00.',
  },
  {
    ...STUDENT_NOTIFICATIONS[1],
    title: 'Студент оставил комментарий',
    desc: 'Анна Петрова добавила комментарий к заданию по Present Perfect.',
  },
  {
    ...STUDENT_NOTIFICATIONS[2],
    title: 'Сдано домашнее задание',
    desc: 'Иван Васильев отправил задание по уроку Conditionals.',
  },
  {
    ...STUDENT_NOTIFICATIONS[3],
    title: 'Начисление за урок',
    desc: 'За проведённый урок Business English начислено 1 занятие.',
  },
  {
    ...STUDENT_NOTIFICATIONS[4],
    title: 'Урок отменён',
    desc: 'Студент отменил урок Speaking Club на 12 июля.',
  },
  {
    ...STUDENT_NOTIFICATIONS[5],
    title: 'Запрос на перенос',
    desc: 'Иван Васильев просит перенести Business English на 18:30.',
  },
];

const ADMIN_NOTIFICATIONS: NotificationItem[] = [
  {
    ...STUDENT_NOTIFICATIONS[0],
    title: 'Урок скоро начнётся',
    desc: 'В 19:00 запланирован урок Business Negotiations.',
  },
  {
    ...STUDENT_NOTIFICATIONS[1],
    title: 'Новое обращение',
    desc: 'Студент оставил комментарий по уроку Present Perfect.',
  },
  {
    ...STUDENT_NOTIFICATIONS[2],
    title: 'Просроченные задания',
    desc: '4 домашних задания не проверены больше суток.',
  },
  {
    ...STUDENT_NOTIFICATIONS[3],
    title: 'Низкий баланс',
    desc: 'У 3 студентов осталось меньше 2 кредитов.',
  },
  {
    ...STUDENT_NOTIFICATIONS[4],
    title: 'Урок отменён',
    desc: 'Speaking Club на 12 июля отменён преподавателем.',
  },
  {
    ...STUDENT_NOTIFICATIONS[5],
    title: 'Время урока изменилось',
    desc: 'Business English перенесён на 18:30.',
  },
];

export const NOTIFICATIONS = STUDENT_NOTIFICATIONS;

export const NOTIFICATIONS_BY_ROLE: Record<'student' | 'teacher' | 'admin', NotificationItem[]> = {
  student: STUDENT_NOTIFICATIONS,
  teacher: TEACHER_NOTIFICATIONS,
  admin: ADMIN_NOTIFICATIONS,
};

export const GROUP_LABELS: { key: NotifPeriod; label: string }[] = [
  { key: 'today', label: 'Сегодня' },
  { key: 'yesterday', label: 'Вчера' },
  { key: 'earlier', label: 'Ранее' },
];

export function filterNotifications(
  items: NotificationItem[],
  type: string,
  period: string,
  unreadOnly: boolean,
): NotificationItem[] {
  const kind = TYPE_TO_KIND[type] ?? null;
  const periodKey = PERIOD_TO_KEY[period] ?? null;
  return items.filter((item) => {
    if (kind === 'lesson') {
      if (item.kind !== 'lesson' && item.kind !== 'reschedule') return false;
    } else if (kind && item.kind !== kind) {
      return false;
    }
    if (periodKey && item.period !== periodKey) return false;
    if (unreadOnly && !item.unread) return false;
    return true;
  });
}
