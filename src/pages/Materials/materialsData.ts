export type MaterialKind = 'file' | 'link' | 'homework' | 'note';
export type MaterialStatus = 'available' | 'todo' | 'new';
export type MaterialAction = 'download' | 'open';
export type MaterialTypeFilter = 'all' | MaterialKind;

export type MaterialItem = {
  id: string;
  kind: MaterialKind;
  typeLabel: string;
  title: string;
  category: string;
  teacher: string;
  date: string;
  status: MaterialStatus;
  statusLabel: string;
  action: MaterialAction;
};

export type MaterialGroup = {
  id: string;
  title: string;
  items: MaterialItem[];
};

export type MaterialFilters = {
  lesson: string;
  period: string;
  type: MaterialTypeFilter;
};

export const WEEK_TITLE = '29 июня - 5 июля 2026';

export const LESSON_OPTIONS = [
  'Все уроки',
  'Последний урок',
  'Грамматика',
  'Разговорная практика',
  'Presentation',
  'Список фраз',
  'Ответ от преподавателя',
] as const;

export const PERIOD_OPTIONS = [
  'Все периоды',
  'Сегодня',
  'За неделю',
  'За месяц',
  'За всё время',
] as const;

export const TYPE_CHIPS: { id: MaterialTypeFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'file', label: 'Файлы' },
  { id: 'link', label: 'Ссылки' },
  { id: 'homework', label: 'Домашние задания' },
  { id: 'note', label: 'Заметки' },
];

export const DEFAULT_MATERIAL_FILTERS: MaterialFilters = {
  lesson: 'Все уроки',
  period: 'Все периоды',
  type: 'all',
};

const TEMPLATE: Omit<MaterialItem, 'id'>[] = [
  {
    kind: 'file',
    typeLabel: 'Презентация',
    title: 'Presentation',
    category: 'Грамматика',
    teacher: 'Анна Петрова',
    date: '16.05.2026',
    status: 'available',
    statusLabel: 'Доступен',
    action: 'download',
  },
  {
    kind: 'link',
    typeLabel: 'Ссылка',
    title: 'Список фраз',
    category: 'Грамматика',
    teacher: 'Анна Петрова',
    date: '16.05.2026',
    status: 'available',
    statusLabel: 'Доступна',
    action: 'open',
  },
  {
    kind: 'homework',
    typeLabel: 'Домашнее задание',
    title: 'Грамматика',
    category: 'Грамматика',
    teacher: 'Анна Петрова',
    date: '16.05.2026',
    status: 'todo',
    statusLabel: 'Нужно выполнить',
    action: 'open',
  },
  {
    kind: 'note',
    typeLabel: 'Заметка',
    title: 'Ответ от преподавателя',
    category: 'Грамматика',
    teacher: 'Анна Петрова',
    date: '16.05.2026',
    status: 'new',
    statusLabel: 'Новая',
    action: 'open',
  },
];

export const MATERIAL_GROUPS: MaterialGroup[] = [0, 1, 2].map((weekIndex) => ({
  id: `week-${weekIndex}`,
  title: WEEK_TITLE,
  items: TEMPLATE.map((item, itemIndex) => ({
    ...item,
    id: `w${weekIndex}-${itemIndex}`,
  })),
}));

export function isMaterialsDirty(filters: MaterialFilters): boolean {
  return (
    filters.lesson !== DEFAULT_MATERIAL_FILTERS.lesson ||
    filters.period !== DEFAULT_MATERIAL_FILTERS.period ||
    filters.type !== DEFAULT_MATERIAL_FILTERS.type
  );
}

export function filterMaterialGroups(
  groups: MaterialGroup[],
  filters: MaterialFilters,
): MaterialGroup[] {
  if (filters.period === 'Сегодня' || filters.period === 'За неделю' || filters.period === 'За месяц') {
    return [];
  }

  return groups
    .map((group, index) => {
      if (filters.lesson === 'Последний урок' && index > 0) {
        return { ...group, items: [] };
      }

      const items = group.items.filter((item) => {
        if (filters.type !== 'all' && item.kind !== filters.type) return false;
        if (filters.lesson === 'Все уроки' || filters.lesson === 'Последний урок') return true;
        return item.title === filters.lesson || item.category === filters.lesson;
      });

      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);
}
