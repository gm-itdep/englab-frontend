export const PERIOD_OPTIONS = [
  'За последние 6 месяцев',
  'За последние 3 месяца',
  'За последний год',
] as const;

export const DEFAULT_PERIOD = PERIOD_OPTIONS[0];

export const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'] as const;

export const FOCUS_ITEMS = ['Спонтанная речь', 'Аргументация в диалоге', 'Деловые обсуждения'] as const;

export type SkillTone = 'lime' | 'info' | 'warning';

export const SKILLS: { name: string; badge: string; tone: SkillTone; fill: number }[] = [
  { name: 'Деловые встречи', badge: 'Уверенно', tone: 'lime', fill: 22 },
  { name: 'Переговоры', badge: 'Развивается', tone: 'info', fill: 18 },
  { name: 'Презентации', badge: 'В работе', tone: 'warning', fill: 14 },
  { name: 'Деловая лексика', badge: 'Хорошо', tone: 'lime', fill: 20 },
];

export const STATS: { key: string; label: string; value: string; icon: 'lesson' | 'note' | 'check' }[] =
  [
    { key: 'lessons', label: 'Пройдено уроков', value: '68', icon: 'lesson' },
    { key: 'topics', label: 'Тем изучено', value: '78', icon: 'note' },
    { key: 'homework', label: 'Домашних заданий выполнено', value: '48', icon: 'check' },
  ];

export const EMPTY_COPY = {
  goalTitle: 'Цель обучения пока не выбрана',
  goalDesc: 'Выберите цель, чтобы мы могли точнее показывать ваш прогресс и фокус обучения.',
  goalCta: 'Выбрать цель',
  skillsTitle: 'Недостаточно данных',
  skillsDesc: 'Показатели появятся после первых уроков и обратной связи преподавателей.',
  historyTitle: 'История прогресса пока пуста',
  historyDesc: 'После первых занятий здесь появится динамика уровня, уроков и выполненных заданий',
  recsTitle: 'Рекомендаций пока нет',
  recsDesc: 'После завершённых уроков преподаватели смогут оставлять рекомендации по развитию.',
} as const;

export const RECS = [
  {
    id: '1',
    name: 'Кожевников Иван',
    lesson: 'Переговоры',
    tags: ['Business', 'Speaking', 'Interview'],
    text: 'А также сделанные на базе интернет-аналитики выводы лишь добавляют фракционных разногласий и обнародованы.',
  },
  {
    id: '2',
    name: 'Кожевников Иван',
    lesson: 'Переговоры',
    tags: ['Business', 'Speaking', 'Interview'],
    text: 'А также сделанные на базе интернет-аналитики выводы лишь добавляют фракционных разногласий и обнародованы.',
  },
  {
    id: '3',
    name: 'Кожевников Иван',
    lesson: 'Переговоры',
    tags: ['Business', 'Speaking', 'Interview'],
    text: 'А также сделанные на базе интернет-аналитики выводы лишь добавляют фракционных разногласий и обнародованы.',
  },
  {
    id: '4',
    name: 'Кожевников Иван',
    lesson: 'Переговоры',
    tags: ['Business', 'Speaking', 'Interview'],
    text: 'А также сделанные на базе интернет-аналитики выводы лишь добавляют фракционных разногласий и обнародованы.',
  },
];
