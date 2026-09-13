export type BalanceTxKind = 'topup' | 'debit' | 'refund';
export type BalanceTab = 'all' | 'topup' | 'debit' | 'refund';

export type BalanceTransaction = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  kind: BalanceTxKind;
  typeLabel: string;
  creditsLabel: string;
};

export const PERIOD_OPTIONS = [
  'Все время',
  'Сегодня',
  'За неделю',
  'За месяц',
  'За 3 месяца',
  'За год',
] as const;

export const DEFAULT_PERIOD = 'Все время';

export const DESKTOP_TABS: { id: BalanceTab; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'topup', label: 'Поступления' },
  { id: 'debit', label: 'Списания' },
  { id: 'refund', label: 'Возвраты' },
];

export const MOBILE_TABS: { id: BalanceTab; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'topup', label: 'Поступления' },
  { id: 'debit', label: 'Списания' },
];

export const BALANCE_TRANSACTIONS: BalanceTransaction[] = [
  {
    id: 'tx-1',
    date: '16.05.2026',
    title: 'Пополнение баланса',
    subtitle: 'Пополнение с карты ****1234',
    kind: 'topup',
    typeLabel: 'Пополнение',
    creditsLabel: '+10',
  },
  {
    id: 'tx-2',
    date: '14.05.2026',
    title: 'Урок с Маргаритой Васильевой',
    subtitle: 'Speaking',
    kind: 'debit',
    typeLabel: 'Списание',
    creditsLabel: '-10',
  },
  {
    id: 'tx-3',
    date: '13.05.2026',
    title: 'Пополнение баланса',
    subtitle: 'Пополнение с карты ****1234',
    kind: 'topup',
    typeLabel: 'Пополнение',
    creditsLabel: '+10',
  },
  {
    id: 'tx-4',
    date: '12.05.2026',
    title: 'Урок с Маргаритой Васильевой',
    subtitle: 'Speaking',
    kind: 'debit',
    typeLabel: 'Списание',
    creditsLabel: '-10',
  },
  {
    id: 'tx-5',
    date: '11.05.2026',
    title: 'Пополнение баланса',
    subtitle: 'Пополнение с карты ****1234',
    kind: 'topup',
    typeLabel: 'Пополнение',
    creditsLabel: '+10',
  },
  {
    id: 'tx-6',
    date: '10.05.2026',
    title: 'Урок с Маргаритой Васильевой',
    subtitle: 'Speaking',
    kind: 'debit',
    typeLabel: 'Списание',
    creditsLabel: '-10',
  },
  {
    id: 'tx-7',
    date: '09.05.2026',
    title: 'Пополнение баланса',
    subtitle: 'Пополнение с карты ****1234',
    kind: 'topup',
    typeLabel: 'Пополнение',
    creditsLabel: '+10',
  },
  {
    id: 'tx-8',
    date: '08.05.2026',
    title: 'Урок с Маргаритой Васильевой',
    subtitle: 'Speaking',
    kind: 'debit',
    typeLabel: 'Списание',
    creditsLabel: '-10',
  },
  {
    id: 'tx-9',
    date: '07.05.2026',
    title: 'Пополнение баланса',
    subtitle: 'Пополнение с карты ****1234',
    kind: 'topup',
    typeLabel: 'Пополнение',
    creditsLabel: '+10',
  },
  {
    id: 'tx-10',
    date: '06.05.2026',
    title: 'Урок с Маргаритой Васильевой',
    subtitle: 'Speaking',
    kind: 'debit',
    typeLabel: 'Списание',
    creditsLabel: '-10',
  },
  {
    id: 'tx-11',
    date: '05.05.2026',
    title: 'Возврат средств',
    subtitle: 'Отменённый урок с Маргаритой Васильевой',
    kind: 'refund',
    typeLabel: 'Возврат',
    creditsLabel: '+1',
  },
];

export function filterBalanceTransactions(
  items: BalanceTransaction[],
  tab: BalanceTab,
  period: string,
): BalanceTransaction[] {
  if (period === 'Сегодня' || period === 'За неделю' || period === 'За месяц') {
    return [];
  }

  if (tab === 'all') return items;
  return items.filter((item) => item.kind === tab);
}
