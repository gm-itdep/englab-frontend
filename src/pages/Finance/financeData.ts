export type FinanceTxType = 'lesson_debit' | 'topup' | 'refund' | 'credit';

export type FinanceTransaction = {
  id: string;
  date: string;
  time: string;
  studentName: string;
  type: FinanceTxType;
  creditsLabel: string;
  amountLabel: string;
};

export const TYPE_FILTER_ALL = 'Все типы';

export const TYPE_FILTER_OPTIONS = [
  TYPE_FILTER_ALL,
  'Пополнение баланса',
  'Списание за урок',
  'Возврат',
  'Начисление кредитов',
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

export const TYPE_LABELS: Record<FinanceTxType, string> = {
  lesson_debit: 'Списание за урок',
  topup: 'Пополнение баланса',
  refund: 'Возврат',
  credit: 'Начисление кредитов',
};

export const PAGE_SIZE = 8;

const TYPE_CYCLE: FinanceTxType[] = [
  'lesson_debit',
  'topup',
  'refund',
  'credit',
  'lesson_debit',
  'lesson_debit',
  'topup',
  'credit',
];

export function getFinanceTransactions(): FinanceTransaction[] {
  return Array.from({ length: 43 }, (_, index) => {
    const type = TYPE_CYCLE[index % TYPE_CYCLE.length];
    const isDebit = type === 'lesson_debit';
    return {
      id: `tx-${index + 1}`,
      date: '15 июня 2026',
      time: '14:00',
      studentName: `Иван Васильев ${index + 1}`,
      type,
      creditsLabel: isDebit ? '+100 кредитов' : type === 'refund' ? '+50 кредитов' : '+100 кредитов',
      amountLabel: isDebit ? '1 990₽' : type === 'topup' ? '2 500₽' : '1 990₽',
    };
  });
}

export function typeMatchesFilter(type: FinanceTxType, filter: string): boolean {
  if (!filter || filter === TYPE_FILTER_ALL) return true;
  return TYPE_LABELS[type] === filter;
}
