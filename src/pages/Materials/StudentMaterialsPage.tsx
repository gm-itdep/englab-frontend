import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StudentLayout } from '../Home/StudentLayout';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import ICON_SEARCH from '../../assets/icons/student/search.svg';
import ICON_FILTER from '../../assets/icons/student/filter.svg';
import ICON_FILE from '../../assets/icons/student/file.svg';
import ICON_LINK from '../../assets/icons/student/materials/link.svg';
import ICON_HOMEWORK from '../../assets/icons/student/materials/homework.svg';
import ICON_NOTE from '../../assets/icons/student/materials/note.svg';
import ICON_DOWNLOAD from '../../assets/icons/student/materials/download.svg';
import ICON_OPEN from '../../assets/icons/student/materials/open.svg';
import ICON_EMPTY from '../../assets/icons/student/materials/empty.svg';
import {
  DEFAULT_MATERIAL_FILTERS,
  LESSON_OPTIONS,
  MATERIAL_GROUPS,
  PERIOD_OPTIONS,
  TYPE_CHIPS,
  filterMaterialGroups,
  isMaterialsDirty,
  type MaterialFilters,
  type MaterialItem,
  type MaterialKind,
  type MaterialTypeFilter,
} from './materialsData';
import styles from './StudentMaterialsPage.module.css';

const KIND_ICONS: Record<MaterialKind, string> = {
  file: ICON_FILE,
  link: ICON_LINK,
  homework: ICON_HOMEWORK,
  note: ICON_NOTE,
};

const MOBILE_FILTER_ITEMS = [
  { key: 'lesson' as const, label: 'Статус урока', options: LESSON_OPTIONS },
  { key: 'period' as const, label: 'Период уроков', options: PERIOD_OPTIONS },
  { key: 'type' as const, label: 'Тип', options: TYPE_CHIPS.map((chip) => chip.label) },
];

function typeLabelToId(label: string): MaterialTypeFilter {
  return TYPE_CHIPS.find((chip) => chip.label === label)?.id ?? 'all';
}

function typeIdToLabel(id: MaterialTypeFilter): string {
  return TYPE_CHIPS.find((chip) => chip.id === id)?.label ?? 'Все';
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
    <div className={styles.filterField} ref={rootRef}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.filterSelectWrap}>
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
    </div>
  );
}

function MobileFiltersMenu({
  open,
  filters,
  onClose,
  onChangeLesson,
  onChangePeriod,
  onChangeType,
}: {
  open: boolean;
  filters: MaterialFilters;
  onClose: () => void;
  onChangeLesson: (value: string) => void;
  onChangePeriod: (value: string) => void;
  onChangeType: (value: MaterialTypeFilter) => void;
}) {
  const [view, setView] = useState<(typeof MOBILE_FILTER_ITEMS)[number]['key'] | null>(null);
  const [activeNav, setActiveNav] = useState<(typeof MOBILE_FILTER_ITEMS)[number]['key']>('lesson');

  useEffect(() => {
    if (!open) {
      setView(null);
      setActiveNav('lesson');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const activeItem = MOBILE_FILTER_ITEMS.find((item) => item.key === view);

  return (
    <>
      <button type="button" className={styles.mobileFiltersBackdrop} aria-label="Закрыть" onClick={onClose} />
      <div className={styles.mobileFiltersMenu} role="dialog" aria-label="Фильтры">
        {activeItem ? (
          activeItem.options.map((option) => {
            const selected =
              activeItem.key === 'type'
                ? typeIdToLabel(filters.type) === option
                : filters[activeItem.key] === option;
            return (
              <button
                key={option}
                type="button"
                className={[styles.mobileFiltersItem, selected ? styles.mobileFiltersItemActive : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  if (activeItem.key === 'lesson') onChangeLesson(option);
                  if (activeItem.key === 'period') onChangePeriod(option);
                  if (activeItem.key === 'type') onChangeType(typeLabelToId(option));
                  onClose();
                }}
              >
                <span className={styles.mobileFiltersItemLabel}>{option}</span>
              </button>
            );
          })
        ) : (
          MOBILE_FILTER_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={[styles.mobileFiltersItem, activeNav === item.key ? styles.mobileFiltersItemActive : '']
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setActiveNav(item.key)}
              onFocus={() => setActiveNav(item.key)}
              onClick={() => setView(item.key)}
            >
              <span className={styles.mobileFiltersItemLabel}>{item.label}</span>
              <span className={styles.mobileFiltersItemChevron}>
                <img src={ICON_ARROW_LITE} alt="" width={14} height={14} />
              </span>
            </button>
          ))
        )}
      </div>
    </>
  );
}

function TypeSwitcher({
  value,
  onChange,
}: {
  value: MaterialTypeFilter;
  onChange: (next: MaterialTypeFilter) => void;
}) {
  return (
    <div className={styles.typeSwitch} role="tablist" aria-label="Тип материала">
      {TYPE_CHIPS.map((chip) => {
        const active = chip.id === value;
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={[styles.typeChip, active ? styles.typeChipActive : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(chip.id)}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

function StatusBadge({ item }: { item: MaterialItem }) {
  const className = [
    styles.badge,
    item.status === 'available' ? styles.badgeAvailable : '',
    item.status === 'todo' ? styles.badgeTodo : '',
    item.status === 'new' ? styles.badgeNew : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={className}>{item.statusLabel}</span>;
}

function ActionButton({ item }: { item: MaterialItem }) {
  const isDownload = item.action === 'download';
  return (
    <button
      type="button"
      className={[styles.actionBtn, isDownload ? styles.actionPrimary : styles.actionOutline]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.actionIcon}>
        <img src={isDownload ? ICON_DOWNLOAD : ICON_OPEN} alt="" width={17} height={17} />
      </span>
      {isDownload ? 'Скачать' : 'Открыть'}
    </button>
  );
}

function MaterialRow({ item }: { item: MaterialItem }) {
  return (
    <article className={styles.row}>
      <div className={styles.rowDesktop}>
        <div className={styles.rowName}>
          <div className={styles.kind}>
            <span className={styles.kindIcon}>
              <img src={KIND_ICONS[item.kind]} alt="" width={28} height={28} />
            </span>
            <span className={styles.kindLabel}>{item.typeLabel}</span>
          </div>
          <p className={styles.rowTitle}>{item.title}</p>
        </div>
        <div className={styles.rowDetails}>
          <div className={styles.rowDetailLeft}>
            <div className={styles.rowMeta}>
              <span className={styles.metaCategory}>{item.category}</span>
              <span className={styles.metaTeacher}>{item.teacher}</span>
              <span className={styles.metaDate}>{item.date}</span>
            </div>
            <StatusBadge item={item} />
          </div>
          <ActionButton item={item} />
        </div>
      </div>

      <div className={styles.rowMobile}>
        <StatusBadge item={item} />
        <div className={styles.mobileContent}>
          <div className={styles.mobileName}>
            <span className={styles.kindIconMobile}>
              <img src={KIND_ICONS[item.kind]} alt="" width={22} height={22} />
            </span>
            <div className={styles.mobileText}>
              <p className={styles.rowTitle}>{item.title}</p>
              <p className={styles.kindLabel}>{item.typeLabel}</p>
            </div>
          </div>
          <div className={styles.mobileMeta}>
            <p className={styles.mobileCategory}>{item.category}</p>
            <p>{item.teacher}</p>
            <p>{item.date}</p>
          </div>
        </div>
        <ActionButton item={item} />
      </div>
    </article>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon}>
        <img src={ICON_EMPTY} alt="" width={70} height={70} />
      </span>
      <div className={styles.emptyText}>
        <p className={styles.emptyTitle}>Материалов пока нет</p>
        <p className={styles.emptyDesc}>
          Когда преподаватель загрузит файлы, ссылки, домашние задания, заметки, они появятся здесь.
        </p>
      </div>
      <button type="button" className={styles.emptyReset} onClick={onReset}>
        Сбросить фильтры
      </button>
    </div>
  );
}

export function StudentMaterialsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEmptyQuery = searchParams.get('empty') === '1';

  const [filters, setFilters] = useState<MaterialFilters>(DEFAULT_MATERIAL_FILTERS);
  const [openKey, setOpenKey] = useState<'lesson' | 'period' | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const isDirty = isMaterialsDirty(filters);
  const groups = isEmptyQuery ? [] : filterMaterialGroups(MATERIAL_GROUPS, filters);
  const showEmpty = groups.length === 0;

  const resetFilters = () => {
    setFilters(DEFAULT_MATERIAL_FILTERS);
    setOpenKey(null);
    setMobileFiltersOpen(false);
    if (!isEmptyQuery) return;
    const next = new URLSearchParams(searchParams);
    next.delete('empty');
    const query = next.toString();
    navigate({ search: query ? `?${query}` : '' }, { replace: true });
  };

  return (
    <StudentLayout
      title="Материалы"
      subtitle="Учебный архив"
      activeNav="materials"
      hideMobileSearch
    >
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
              filters={filters}
              onClose={() => setMobileFiltersOpen(false)}
              onChangeLesson={(value) => setFilters((current) => ({ ...current, lesson: value }))}
              onChangePeriod={(value) => setFilters((current) => ({ ...current, period: value }))}
              onChangeType={(value) => setFilters((current) => ({ ...current, type: value }))}
            />
          </div>
        </div>

        <section className={styles.filters} aria-label="Фильтры">
          <div className={styles.filtersLeft}>
            <FilterSelect
              label="Статус урока"
              options={LESSON_OPTIONS}
              value={filters.lesson}
              open={openKey === 'lesson'}
              onToggle={() => setOpenKey((current) => (current === 'lesson' ? null : 'lesson'))}
              onChange={(value) => setFilters((current) => ({ ...current, lesson: value }))}
            />
            <FilterSelect
              label="Период уроков"
              options={PERIOD_OPTIONS}
              value={filters.period}
              open={openKey === 'period'}
              onToggle={() => setOpenKey((current) => (current === 'period' ? null : 'period'))}
              onChange={(value) => setFilters((current) => ({ ...current, period: value }))}
            />
            <TypeSwitcher
              value={filters.type}
              onChange={(type) => setFilters((current) => ({ ...current, type }))}
            />
          </div>
          <button
            type="button"
            className={[
              styles.resetBtn,
              isDirty ? styles.resetBtnActive : '',
              showEmpty && !isDirty ? styles.resetBtnEmpty : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={!isDirty && !showEmpty}
            onClick={resetFilters}
          >
            Сбросить фильтры
          </button>
        </section>

        <section className={[styles.listCard, showEmpty ? styles.listCardEmpty : ''].filter(Boolean).join(' ')}>
          {showEmpty ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            groups.map((group) => (
              <div key={group.id} className={styles.group}>
                <h2 className={styles.weekTitle}>{group.title}</h2>
                <div className={styles.groupList}>
                  {group.items.map((item) => (
                    <MaterialRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </StudentLayout>
  );
}
