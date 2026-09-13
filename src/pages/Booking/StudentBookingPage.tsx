import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StudentLayout } from '../Home/StudentLayout';
import { Button } from '../../components/ui';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import ICON_SEARCH from '../../assets/icons/student/search.svg';
import ICON_FILTER from '../../assets/icons/student/filter.svg';
import ICON_HEART from '../../assets/icons/student/booking/heart-filled.svg';
import ICON_HEART_PRESSED from '../../assets/icons/student/booking/heart.svg';
import ICON_STAR from '../../assets/icons/student/booking/star.svg';
import ICON_RETURN from '../../assets/icons/student/booking/return.svg';
import ICON_RETURN_ACTIVE from '../../assets/icons/student/booking/return-active.svg';
import ICON_CHECK from '../../assets/icons/student/booking/check-mark.svg';
import ICON_CALENDAR from '../../assets/icons/student/booking/calendar.svg';
import ICON_SLOT from '../../assets/icons/student/booking/slot.svg';
import ICON_DOTS from '../../assets/icons/student/booking/pagination-dots.svg';
import ICON_EMPTY_PERSON from '../../assets/icons/student/booking/empty-person.svg';
import {
  BOOKING_TEACHERS,
  DEFAULT_FILTERS,
  FOUND_COUNT,
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  SPEC_OPTIONS,
  TIME_OPTIONS,
  type BookingTeacher,
  type FilterKey,
  type FilterValues,
} from './bookingData';
import styles from './StudentBookingPage.module.css';

const FILTERS: {
  key: FilterKey;
  label: string;
  placeholder: string;
  options: readonly string[];
  goalWidth?: boolean;
}[] = [
  { key: 'goal', label: 'Цель', placeholder: 'Ваша цель', options: GOAL_OPTIONS, goalWidth: true },
  { key: 'level', label: 'Уровень', placeholder: 'Ваш уровень', options: LEVEL_OPTIONS },
  { key: 'time', label: 'Время', placeholder: 'Удобное время', options: TIME_OPTIONS },
  { key: 'spec', label: 'Специализация', placeholder: 'Специализация', options: SPEC_OPTIONS },
];

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  open,
  onToggle,
  onChange,
  goalWidth,
}: {
  label: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  open: boolean;
  onToggle: () => void;
  onChange: (next: string) => void;
  goalWidth?: boolean;
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
    <div
      className={[styles.filterField, goalWidth ? styles.filterFieldGoal : ''].filter(Boolean).join(' ')}
      ref={rootRef}
    >
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
          <span>{value || placeholder}</span>
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

function TeacherCard({
  teacher,
  favorite,
  onToggleFavorite,
  onBook,
}: {
  teacher: BookingTeacher;
  favorite: boolean;
  onToggleFavorite: () => void;
  onBook: () => void;
}) {
  return (
    <article className={styles.card}>
      <div className={teacher.matched ? styles.cardHeader : styles.cardHeaderEnd}>
        {teacher.matched ? (
          <span className={styles.matchBadge}>
            <span className={styles.checkWrap}>
              <img src={ICON_CHECK} alt="" width={14} height={14} />
            </span>
            Вам точно подходит
          </span>
        ) : null}
        <button
          type="button"
          className={styles.heartBtn}
          aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={favorite}
          onClick={onToggleFavorite}
        >
          <img
            src={favorite ? ICON_HEART_PRESSED : ICON_HEART}
            alt=""
            width={28}
            height={28}
          />
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.teacherRow}>
          <div className={styles.photoWrap}>
            <img src={teacher.photo} alt="" className={styles.photo} />
          </div>
          <div className={styles.teacherInfo}>
            <div className={styles.summary}>
              <h2 className={styles.teacherName}>{teacher.name}</h2>
              <p className={styles.rating}>
                <span className={styles.starWrap}>
                  <img src={ICON_STAR} alt="" width={17} height={17} />
                </span>
                {teacher.rating}
              </p>
            </div>
            <div className={styles.attrs}>
              <p className={styles.meta}>
                {teacher.language}
                <span className={styles.metaDot} aria-hidden="true">
                  •
                </span>
                {teacher.accent}
              </p>
              <ul className={styles.tags}>
                {teacher.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
              <p className={styles.levels}>
                <span className={styles.levelsLabel}>Уровни:</span>
                <span className={styles.levelsValue}>{teacher.levels}</span>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.availability}>
            <div className={styles.availItem}>
              <span className={styles.availIcon}>
                <img src={ICON_CALENDAR} alt="" width={28} height={28} />
              </span>
              <p className={styles.availText}>
                <span className={styles.availLabel}>Ближайшие время</span>
                <span className={styles.availValue}>{teacher.nextSlot}</span>
              </p>
            </div>
            <div className={styles.availItem}>
              <span className={styles.availIcon}>
                <img src={ICON_SLOT} alt="" width={28} height={28} />
              </span>
              <p className={styles.availText}>
                <span className={styles.availLabel}>Свободные слоты</span>
                <span className={styles.availValue}>{teacher.freeSlots}</span>
              </p>
            </div>
          </div>
          <p className={styles.bio}>{teacher.bio}</p>
        </div>
      </div>

      <Button fullWidth onClick={onBook}>
        Забронировать урок
      </Button>
    </article>
  );
}

export function StudentBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previewSearch = searchParams.toString();

  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(BOOKING_TEACHERS.map((teacher) => [teacher.id, Boolean(teacher.favorite)])),
  );

  const isEmpty = searchParams.get('empty') === '1';
  const foundCount = isEmpty ? 0 : FOUND_COUNT;
  const isDirty = Object.values(filters).some(Boolean);

  const handleBack = () => {
    navigate(previewSearch ? `/home?${previewSearch}` : '/home');
  };

  const handleToggle = (key: FilterKey) => {
    setOpenKey((current) => (current === key ? null : key));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setOpenKey(null);
    if (isEmpty) {
      const next = new URLSearchParams(searchParams);
      next.delete('empty');
      const query = next.toString();
      navigate(query ? `/booking?${query}` : '/booking');
    }
  };

  return (
    <StudentLayout
      title="Запись на урок"
      subtitle="Шаг 1 и 3"
      activeNav="booking"
      showBack
      hideMobileSearch
      titleSize="lg"
      onBack={handleBack}
    >
      <div className={styles.pageBody}>
        <div className={styles.mobileToolbar}>
          <label className={styles.search}>
            <span className={styles.searchIcon}>
              <img src={ICON_SEARCH} alt="" width={14} height={14} />
            </span>
            <input type="search" placeholder="Поиск по материалам и урокам" />
          </label>
          <button
            type="button"
            className={styles.filterBtn}
            aria-label="Фильтры"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <span className={styles.filterBtnIcon}>
              <img src={ICON_FILTER} alt="" width={22} height={22} />
            </span>
          </button>
        </div>

        <section
          className={[styles.filters, filtersOpen ? styles.filtersOpen : ''].filter(Boolean).join(' ')}
          aria-label="Фильтры"
        >
          <div className={styles.filtersFields}>
            {FILTERS.map((item) => (
              <FilterSelect
                key={item.key}
                label={item.label}
                placeholder={item.placeholder}
                options={item.options}
                value={filters[item.key]}
                open={openKey === item.key}
                onToggle={() => handleToggle(item.key)}
                onChange={(value) => {
                  setFilters((current) => ({ ...current, [item.key]: value }));
                }}
                goalWidth={item.goalWidth}
              />
            ))}
          </div>
          <button
            type="button"
            className={[styles.resetBtn, isDirty ? styles.resetBtnActive : ''].filter(Boolean).join(' ')}
            disabled={!isDirty}
            onClick={handleResetFilters}
          >
            <span className={styles.resetIcon}>
              <img src={isDirty ? ICON_RETURN_ACTIVE : ICON_RETURN} alt="" width={17} height={17} />
            </span>
            Сбросить фильтры
          </button>
        </section>

        <section className={styles.results} aria-label="Преподаватели">
          <p className={styles.found}>
            <span className={styles.foundLabel}>Найдено:</span>
            <span className={styles.foundCount}>{foundCount}</span>
          </p>

          {isEmpty ? (
            <section className={styles.emptyCard} aria-label="Преподаватели не найдены">
              <div className={styles.emptyContent}>
                <span className={styles.emptyIcon}>
                  <img src={ICON_EMPTY_PERSON} alt="" width={70} height={70} />
                </span>
                <div className={styles.emptyText}>
                  <p className={styles.emptyTitle}>Преподаватели не найдены</p>
                  <p className={styles.emptyDesc}>
                    По выбранным параметрам нет подходящих преподавателей. Попробуйте изменить
                    фильтры.
                  </p>
                </div>
              </div>
              <button type="button" className={styles.emptyReset} onClick={handleResetFilters}>
                Сбросить фильтры
              </button>
            </section>
          ) : (
            <>
          <div className={styles.grid}>
            {BOOKING_TEACHERS.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                favorite={Boolean(favorites[teacher.id])}
                onToggleFavorite={() => {
                  setFavorites((current) => ({
                    ...current,
                    [teacher.id]: !current[teacher.id],
                  }));
                }}
                onBook={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete('empty');
                  next.delete('loading');
                  next.set('teacher', teacher.id);
                  navigate(`/booking/slot?${next.toString()}`);
                }}
              />
            ))}
          </div>

          <nav className={styles.pagination} aria-label="Страницы">
            <button
              type="button"
              className={styles.pageBtn}
              aria-label="Предыдущая страница"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <span className={styles.pageArrow}>
                <img src={ICON_ARROW_LITE} alt="" width={17} height={17} className={styles.pageArrowPrev} />
              </span>
            </button>
            {[1, 2, 3].map((item) => (
              <button
                key={item}
                type="button"
                className={[styles.pageBtn, page === item ? styles.pageBtnActive : ''].filter(Boolean).join(' ')}
                aria-current={page === item ? 'page' : undefined}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ))}
            <span className={styles.pageDots} aria-hidden="true">
              <img src={ICON_DOTS} alt="" width={32} height={32} />
            </span>
            <button
              type="button"
              className={styles.pageBtn}
              aria-label="Следующая страница"
              disabled={page === 3}
              onClick={() => setPage((current) => Math.min(3, current + 1))}
            >
              <span className={styles.pageArrow}>
                <img src={ICON_ARROW_LITE} alt="" width={17} height={17} />
              </span>
            </button>
          </nav>
            </>
          )}
        </section>
      </div>
    </StudentLayout>
  );
}
