import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAppRole } from '../../shared/auth/mockAuth';
import { StudentLayout } from '../Home/StudentLayout';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import ICON_OPEN from '../../assets/icons/student/materials/open.svg';
import ICON_CALENDAR from '../../assets/icons/student/notifications/calendar.svg';
import ICON_MESSAGE from '../../assets/icons/student/notifications/message.svg';
import ICON_NOTE from '../../assets/icons/student/notifications/note.svg';
import ICON_WALLET from '../../assets/icons/student/notifications/wallet.svg';
import ICON_CLOSE from '../../assets/icons/student/notifications/close.svg';
import ICON_TIME from '../../assets/icons/student/notifications/time.svg';
import ICON_EMPTY from '../../assets/icons/student/notifications/empty.svg';
import ICON_FILTER from '../../assets/icons/student/filter.svg';
import {
  GROUP_LABELS,
  NOTIFICATIONS_BY_ROLE,
  PERIOD_ALL,
  PERIOD_OPTIONS,
  TYPE_ALL,
  TYPE_OPTIONS,
  filterNotifications,
  type NotifKind,
  type NotifTone,
  type NotificationItem,
} from './notificationsData';
import styles from './NotificationsPage.module.css';

function kindIcon(kind: NotifKind): string {
  if (kind === 'comment') return ICON_MESSAGE;
  if (kind === 'homework') return ICON_NOTE;
  if (kind === 'balance') return ICON_WALLET;
  if (kind === 'cancelled') return ICON_CLOSE;
  if (kind === 'reschedule') return ICON_TIME;
  return ICON_CALENDAR;
}

function toneClass(tone: NotifTone): string {
  if (tone === 'info') return styles.iconInfo;
  if (tone === 'warning') return styles.iconWarning;
  if (tone === 'error') return styles.iconError;
  return styles.iconGreen;
}

function FilterSelect({
  label,
  options,
  value,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  options: readonly string[];
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
      if (!rootRef.current?.contains(event.target as Node)) onToggle();
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
    <div className={styles.filterField} ref={rootRef}>
      <span className={styles.filterLabel}>{label}</span>
      <button
        type="button"
        className={[styles.filterSelect, open ? styles.filterSelectOpen : ''].filter(Boolean).join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
      >
        <span>{value}</span>
        <span className={[styles.filterChevron, open ? styles.filterChevronOpen : ''].filter(Boolean).join(' ')}>
          <img src={ICON_ARROW_LITE} alt="" width={14} height={14} />
        </span>
      </button>
      {open ? (
        <ul id={listId} className={styles.filterDropdown} role="listbox" aria-label={label}>
          {options.map((option) => {
            const selected = option === value;
            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[styles.filterOption, selected ? styles.filterOptionSelected : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    onChange(option);
                    onToggle();
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

function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <article className={styles.row}>
      <div className={styles.rowHead}>
        <span className={item.unread ? styles.dot : styles.dotEmpty} aria-hidden="true" />
        <p className={styles.time}>{item.time}</p>
      </div>
      <div className={styles.rowMain}>
        <span className={item.unread ? styles.dot : styles.dotEmpty} aria-hidden="true" />
        <div className={styles.rowBody}>
          <span className={[styles.icon, toneClass(item.tone)].join(' ')}>
            <img src={kindIcon(item.kind)} alt="" width={28} height={28} />
          </span>
          <div className={styles.rowText}>
            <p className={styles.rowTitle}>{item.title}</p>
            <p className={styles.rowDesc}>{item.desc}</p>
          </div>
        </div>
      </div>
      <div className={styles.rowActions}>
        <p className={styles.timeDesktop}>{item.time}</p>
        <button type="button" className={styles.openBtn}>
          <span className={styles.openIcon}>
            <img src={ICON_OPEN} alt="" width={17} height={17} />
          </span>
          Открыть
        </button>
      </div>
    </article>
  );
}

export function NotificationsView() {
  const [searchParams] = useSearchParams();
  const role = getAppRole(searchParams);
  const source = NOTIFICATIONS_BY_ROLE[role];
  const isEmptyQuery = searchParams.get('empty') === '1';
  const [type, setType] = useState<string>(TYPE_ALL);
  const [period, setPeriod] = useState<string>(PERIOD_ALL);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [openKey, setOpenKey] = useState<'type' | 'period' | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(() =>
    isEmptyQuery ? [] : source.map((item) => ({ ...item })),
  );

  useEffect(() => {
    setItems(isEmptyQuery ? [] : NOTIFICATIONS_BY_ROLE[role].map((item) => ({ ...item })));
  }, [isEmptyQuery, role]);

  const unreadCount = items.filter((item) => item.unread).length;
  const isDirty = type !== TYPE_ALL || period !== PERIOD_ALL || unreadOnly;
  const filtered = useMemo(
    () => filterNotifications(items, type, period, unreadOnly),
    [items, type, period, unreadOnly],
  );
  const hasUnread = filtered.some((item) => item.unread);

  const handleReset = () => {
    setType(TYPE_ALL);
    setPeriod(PERIOD_ALL);
    setUnreadOnly(false);
  };

  return (
    <StudentLayout
      title="Уведомления"
      subtitle="Важные события и обновления"
      activeNav="notifications"
      hideSearch
      hideMobileSearch
      bellBadge={unreadCount || undefined}
    >
      <div className={styles.pageBody}>
      <div className={styles.mobileToolbar}>
        <button
          type="button"
          className={styles.filterBtn}
          aria-label="Фильтры"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <span className={styles.filterBtnIcon}>
            <img src={ICON_FILTER} alt="" width={24} height={24} />
          </span>
        </button>
      </div>

      <section
        className={[styles.filters, filtersOpen ? styles.filtersOpen : ''].filter(Boolean).join(' ')}
        aria-label="Фильтры"
      >
        <div className={styles.filtersFields}>
          <FilterSelect
            label="Тип"
            options={TYPE_OPTIONS}
            value={type}
            open={openKey === 'type'}
            onToggle={() => setOpenKey((key) => (key === 'type' ? null : 'type'))}
            onChange={setType}
          />
          <FilterSelect
            label="Период"
            options={PERIOD_OPTIONS}
            value={period}
            open={openKey === 'period'}
            onToggle={() => setOpenKey((key) => (key === 'period' ? null : 'period'))}
            onChange={setPeriod}
          />
          <div className={styles.switcher} role="tablist" aria-label="Статус прочтения">
            <button
              type="button"
              role="tab"
              aria-selected={!unreadOnly}
              className={[styles.switcherItem, !unreadOnly ? styles.switcherItemActive : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => setUnreadOnly(false)}
            >
              Все
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={unreadOnly}
              className={[styles.switcherItem, unreadOnly ? styles.switcherItemActive : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => setUnreadOnly(true)}
            >
              Непрочитанные
            </button>
          </div>
        </div>
        <button
          type="button"
          className={[styles.resetBtn, isDirty ? styles.resetBtnActive : ''].filter(Boolean).join(' ')}
          onClick={isDirty ? handleReset : undefined}
        >
          Сбросить фильтры
        </button>
      </section>

      <section className={[styles.listCard, filtered.length === 0 ? styles.listCardEmpty : ''].join(' ')}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <img src={ICON_EMPTY} alt="" width={70} height={70} />
            </span>
            <div className={styles.emptyText}>
              <p className={styles.emptyTitle}>Уведомлений пока нет</p>
              <p className={styles.emptyDesc}>
                Здесь появятся напоминания об уроках, заданиях, материалах и опалте.
              </p>
            </div>
          </div>
        ) : (
          <>
            {hasUnread ? (
              <button
                type="button"
                className={styles.markAll}
                onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))}
              >
                Отметить все как прочитанные
              </button>
            ) : null}
            {GROUP_LABELS.map((group) => {
              const groupItems = filtered.filter((item) => item.period === group.key);
              if (groupItems.length === 0) return null;
              return (
                <div key={group.key} className={styles.group}>
                  <h2 className={styles.groupTitle}>{group.label}</h2>
                  <div className={styles.groupList}>
                    {groupItems.map((item) => (
                      <NotificationRow key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>
      </div>
    </StudentLayout>
  );
}
