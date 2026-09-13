import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StudentLayout } from '../Home/StudentLayout';
import { Button } from '../../components/ui';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import ICON_SEARCH from '../../assets/icons/student/search.svg';
import ICON_FILTER from '../../assets/icons/student/filter.svg';
import {
  BALANCE_TRANSACTIONS,
  DEFAULT_PERIOD,
  DESKTOP_TABS,
  PERIOD_OPTIONS,
  filterBalanceTransactions,
  type BalanceTab,
  type BalanceTransaction,
} from './balanceData';
import styles from './StudentBalancePage.module.css';

function PeriodSelect({
  value,
  open,
  onToggle,
  onChange,
}: {
  value: string;
  open: boolean;
  onToggle: () => void;
  onChange: (next: string) => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onToggle();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onToggle();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onToggle]);

  return (
    <div className={styles.periodWrap} ref={rootRef}>
      <button
        type="button"
        className={[styles.periodSelect, open ? styles.periodSelectOpen : ''].filter(Boolean).join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
      >
        <span>{value}</span>
        <span className={[styles.periodChevron, open ? styles.periodChevronOpen : ''].filter(Boolean).join(' ')}>
          <img src={ICON_ARROW_LITE} alt="" width={14} height={14} />
        </span>
      </button>
      {open ? (
        <ul id={listId} className={styles.periodDropdown} role="listbox" aria-label="Период">
          {PERIOD_OPTIONS.map((option) => {
            const selected = option === value;
            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[styles.periodOption, selected ? styles.periodOptionSelected : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    onChange(option);
                    if (open) onToggle();
                  }}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function MobileFiltersMenu({
  open,
  period,
  onClose,
  onChange,
}: {
  open: boolean;
  period: string;
  onClose: () => void;
  onChange: (value: string) => void;
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button type="button" className={styles.mobileFiltersBackdrop} aria-label="Закрыть" onClick={onClose} />
      <div className={styles.mobileFiltersMenu} role="dialog" aria-label="Период">
        {PERIOD_OPTIONS.map((option) => {
          const selected = option === period;
          return (
            <button
              key={option}
              type="button"
              className={[styles.mobileFiltersItem, selected ? styles.mobileFiltersItemActive : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                onChange(option);
                onClose();
              }}
            >
              <span className={styles.mobileFiltersItemLabel}>{option}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function typeClass(kind: BalanceTransaction['kind']): string {
  if (kind === 'topup') return styles.typeTopup;
  if (kind === 'debit') return styles.typeDebit;
  return styles.typeRefund;
}

function creditsClass(kind: BalanceTransaction['kind']): string {
  return kind === 'debit' ? styles.creditsDebit : styles.creditsPositive;
}

function HistoryRow({ item }: { item: BalanceTransaction }) {
  return (
    <article className={styles.row}>
      <div className={styles.rowDesktop}>
        <p className={styles.colDate}>{item.date}</p>
        <div className={styles.colDesc}>
          <p className={styles.rowTitle}>{item.title}</p>
          <p className={styles.rowSubtitle}>{item.subtitle}</p>
        </div>
        <p className={[styles.colType, typeClass(item.kind)].join(' ')}>{item.typeLabel}</p>
        <p className={[styles.colCredits, creditsClass(item.kind)].join(' ')}>{item.creditsLabel}</p>
        <div className={styles.colStatus}>
          <span className={styles.badge}>Завершено</span>
        </div>
      </div>

      <div className={styles.rowMobile}>
        <div className={styles.mobileTop}>
          <p className={styles.colDate}>{item.date}</p>
          <div className={styles.mobileMeta}>
            <p className={[styles.mobileCredits, creditsClass(item.kind)].join(' ')}>{item.creditsLabel}</p>
            <span className={styles.badge}>Завершено</span>
          </div>
        </div>
        <div className={styles.mobileBody}>
          <p className={styles.rowTitle}>{item.title}</p>
          <p className={styles.rowSubtitle}>{item.subtitle}</p>
          <p className={[styles.mobileType, typeClass(item.kind)].join(' ')}>{item.typeLabel}</p>
        </div>
      </div>
    </article>
  );
}

export function StudentBalancePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<BalanceTab>('all');
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const items = filterBalanceTransactions(BALANCE_TRANSACTIONS, tab, period);
  const role = searchParams.get('role');
  const topupTo = role ? `/balance/topup?role=${role}` : '/balance/topup';

  return (
    <StudentLayout title="Баланс" subtitle="Кредиты и история" activeNav="balance" hideMobileSearch>
      <div className={styles.pageBody}>
        <div className={styles.mobileToolbar}>
          <label className={styles.search}>
            <span className={styles.searchIcon}>
              <img src={ICON_SEARCH} alt="" width={14} height={14} />
            </span>
            <input type="search" placeholder="Поиск по материалам и урокам" />
          </label>
          <div className={styles.mobileFilterWrap}>
            <button
              type="button"
              className={styles.filterBtn}
              aria-label="Фильтры"
              aria-expanded={mobileFiltersOpen}
              onClick={() => setMobileFiltersOpen((open) => !open)}
            >
              <span className={styles.filterBtnIcon}>
                <img src={ICON_FILTER} alt="" width={22} height={22} />
              </span>
            </button>
            <MobileFiltersMenu
              open={mobileFiltersOpen}
              period={period}
              onClose={() => setMobileFiltersOpen(false)}
              onChange={setPeriod}
            />
          </div>
        </div>

        <div className={styles.layout}>
          <section className={styles.historyCard} aria-label="История операций">
            <div className={styles.historyHead}>
              <h2 className={styles.historyTitle}>История операций</h2>
              <PeriodSelect
                value={period}
                open={periodOpen}
                onToggle={() => setPeriodOpen((open) => !open)}
                onChange={setPeriod}
              />
            </div>

            <div className={styles.historyBody}>
              <div className={styles.tabs} role="tablist" aria-label="Тип операции">
                {DESKTOP_TABS.map((item) => {
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={[
                        styles.tab,
                        active ? styles.tabActive : '',
                        item.id === 'refund' ? styles.tabDesktopOnly : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setTab(item.id)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className={styles.table}>
                <div className={styles.tableHead}>
                  <p className={styles.colDate}>Дата</p>
                  <p className={styles.colDescHead}>Описание</p>
                  <p className={styles.colTypeHead}>Тип операции</p>
                  <p className={styles.colCreditsHead}>Кредиты</p>
                  <p className={styles.colStatusHead}>Статус</p>
                </div>
                {items.length === 0 ? (
                  <p className={styles.empty}>За выбранный период операций нет</p>
                ) : (
                  items.map((item) => <HistoryRow key={item.id} item={item} />)
                )}
              </div>
            </div>
          </section>

          <aside className={styles.side}>
            <section className={styles.balanceCard} aria-label="Баланс">
              <div className={styles.sideContent}>
                <h2 className={styles.sideTitle}>Баланс</h2>
                <div className={styles.sideValueBlock}>
                  <p className={styles.sideValue}>56 кредитов</p>
                  <p className={styles.sideCaption}>Доступно 10 уроков</p>
                </div>
              </div>
              <Button fullWidth onClick={() => navigate(topupTo)}>
                Пополнить баланс
              </Button>
            </section>

            <section className={styles.packageCard} aria-label="Активный пакет">
              <div className={styles.sideContent}>
                <h2 className={styles.sideTitle}>Активный пакет</h2>
                <div className={styles.packageBody}>
                  <p className={styles.sideValue}>Standart</p>
                  <div className={styles.progressBlock}>
                    <p className={styles.progressLabel}>Осталось:</p>
                    <div className={styles.progressTrack} aria-hidden="true">
                      <span className={styles.progressFill} />
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" className={styles.packageBtn} onClick={() => navigate(topupTo)}>
                Изменить пакет
              </button>
            </section>
          </aside>
        </div>
      </div>
    </StudentLayout>
  );
}
