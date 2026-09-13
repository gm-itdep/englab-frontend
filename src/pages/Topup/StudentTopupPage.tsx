import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StudentLayout } from '../Home/StudentLayout';
import ICON_SEARCH from '../../assets/icons/student/search.svg';
import ICON_FILTER from '../../assets/icons/student/filter.svg';
import ICON_STAR from '../../assets/icons/student/topup/star.svg';
import ICON_LOCK from '../../assets/icons/student/topup/lock.svg';
import ICON_EMPTY from '../../assets/icons/student/topup/empty.svg';
import ICON_INFO from '../../assets/icons/student/booking/info-gray.svg';
import ICON_CHECK from '../../assets/icons/student/topup/check.svg';
import ICON_CHECK_PAY from '../../assets/icons/student/topup/check-pay.svg';
import ICON_SPINNER from '../../assets/icons/spinner.svg';
import { PACKAGES, type LessonPackage } from './topupData';
import styles from './StudentTopupPage.module.css';

const DESKTOP_ROWS: { key: 'pricePerLesson' | 'pricePackage' | 'lessons'; label: string }[] = [
  { key: 'pricePerLesson', label: 'Цена за урок' },
  { key: 'pricePackage', label: 'Цена за пакет' },
  { key: 'lessons', label: 'Уроков включено' },
];

const MOBILE_ROWS: { key: 'pricePerLesson' | 'pricePackage' | 'lessons'; label: string }[] = [
  { key: 'lessons', label: 'Уроков включено' },
  { key: 'pricePackage', label: 'Цена за пакет' },
  { key: 'pricePerLesson', label: 'Цена за урок' },
];

function PackageCard({
  pkg,
  selected,
  disabled,
  onSelect,
}: {
  pkg: LessonPackage;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={[
        styles.card,
        styles[`tone_${pkg.tone}`],
        pkg.recommended ? styles.cardRecommended : '',
        selected ? styles.cardSelected : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
      disabled={disabled}
    >
      {pkg.recommended || selected ? (
        <span className={styles.cardTop}>
          {pkg.recommended ? (
            <span className={styles.recommend}>
              <span className={styles.recommendIcon}>
                <img src={ICON_STAR} alt="" width={14} height={14} />
              </span>
              Рекомендуем
            </span>
          ) : (
            <span />
          )}
          {selected ? (
            <span className={styles.radio} aria-hidden="true">
              <span className={styles.radioDot} />
            </span>
          ) : null}
        </span>
      ) : null}
      <span className={styles.cardIconWrap}>
        <span className={styles.cardIcon}>
          <img src={pkg.icon} alt="" width={70} height={70} />
        </span>
      </span>
      <span className={styles.cardTitle}>{pkg.name}</span>
      <span className={styles.cardBody}>
        <span className={styles.cardRows}>
          {DESKTOP_ROWS.map((row) => (
            <span key={row.key} className={[styles.cardRow, styles.rowDesktop].join(' ')}>
              <span className={styles.cardRowLabel}>{row.label}</span>
              <span className={styles.cardRowValue}>{pkg[row.key]}</span>
            </span>
          ))}
          {MOBILE_ROWS.map((row) => (
            <span key={`m-${row.key}`} className={[styles.cardRow, styles.rowMobile].join(' ')}>
              <span className={styles.cardRowLabel}>{row.label}</span>
              <span className={styles.cardRowValue}>{pkg[row.key]}</span>
            </span>
          ))}
        </span>
        <span className={styles.cardTagline}>{pkg.tagline}</span>
      </span>
    </button>
  );
}

function SummaryCard({ selected }: { selected: LessonPackage | null }) {
  return (
    <section className={styles.summaryCard} aria-label="Итог перед оплатой">
      <h2 className={styles.summaryTitle}>Итог перед оплатой</h2>
      {selected ? (
        <div className={styles.summaryFilled}>
          <div className={styles.summaryHead}>
            <span className={styles.summaryPkgIcon}>
              <img src={selected.icon} alt="" width={28} height={28} />
            </span>
            <div className={styles.summaryHeadText}>
              <p className={styles.summaryLessons}>{selected.lessons}</p>
              <p className={styles.summaryName}>{selected.name}</p>
            </div>
          </div>
          <div className={styles.summaryPrices}>
            <div className={styles.cardRow}>
              <span className={styles.cardRowLabel}>Цена за пакет</span>
              <span className={styles.cardRowValue}>{selected.pricePackage}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardRowLabel}>Цена за урок</span>
              <span className={styles.cardRowValue}>{selected.pricePerLesson}</span>
            </div>
          </div>
          <div className={styles.fitBadge}>
            <span className={styles.fitIcon}>
              <img src={ICON_CHECK} alt="" width={14} height={14} />
            </span>
            <span>{selected.fit}</span>
          </div>
        </div>
      ) : (
        <div className={styles.summaryEmpty}>
          <span className={styles.emptyIcon}>
            <img src={ICON_EMPTY} alt="" width={45} height={45} />
          </span>
          <p className={styles.emptyText}>Выберите пакет, чтобы увидеть итог</p>
        </div>
      )}
      <div className={styles.secure}>
        <span className={styles.secureIcon}>
          <img src={ICON_LOCK} alt="" width={14} height={14} />
        </span>
        <div className={styles.secureText}>
          <p className={styles.secureCaption}>Ваши данные защищены</p>
          <p className={styles.secureBody}>Платежи проходят через безопасный платёжный сервис.</p>
        </div>
      </div>
    </section>
  );
}

export function StudentTopupPage() {
  const [searchParams] = useSearchParams();
  const payingPreset = searchParams.get('paying') === '1';
  const preset =
    PACKAGES.find((pkg) => pkg.id === searchParams.get('selected'))?.id ??
    (payingPreset ? 'standard' : null);
  const [selectedId, setSelectedId] = useState<string | null>(preset);
  const [paying, setPaying] = useState(Boolean(preset) && payingPreset);
  const selected = PACKAGES.find((pkg) => pkg.id === selectedId) ?? null;

  return (
    <StudentLayout
      title="Пополнение"
      subtitle="Выбор учебного ритма"
      activeNav="balance"
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
          <button type="button" className={styles.filterBtn} aria-label="Фильтры">
            <span className={styles.filterBtnIcon}>
              <img src={ICON_FILTER} alt="" width={22} height={22} />
            </span>
          </button>
        </div>

        <div className={styles.layout}>
          <div className={styles.grid} role="radiogroup" aria-label="Пакеты занятий">
            {PACKAGES.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                selected={selectedId === pkg.id}
                disabled={paying}
                onSelect={() => setSelectedId(pkg.id)}
              />
            ))}
          </div>

          <aside className={styles.side}>
            <SummaryCard selected={selected} />
            <section className={styles.payCard} aria-label="Оплата">
              <div className={styles.payText}>
                <p className={styles.payLabel}>Итого к оплате</p>
                <p className={styles.payValue}>{selected ? selected.pricePackage : '-'}</p>
              </div>
              {paying ? (
                <div className={[styles.infoBadge, styles.payStatus].join(' ')}>
                  <span className={[styles.infoIcon, styles.payStatusIconDesktop].join(' ')}>
                    <img src={ICON_CHECK_PAY} alt="" width={14} height={14} />
                  </span>
                  <span className={[styles.infoIcon, styles.payStatusIconMobile].join(' ')}>
                    <img src={ICON_CHECK} alt="" width={14} height={14} />
                  </span>
                  <span className={styles.payStatusText}>Открываем защищенную страницу оплаты</span>
                </div>
              ) : selected ? null : (
                <div className={styles.infoBadge}>
                  <span className={styles.infoIcon}>
                    <img src={ICON_INFO} alt="" width={14} height={14} />
                  </span>
                  <span>Выберите пакет чтобы продолжить</span>
                </div>
              )}
              <button
                type="button"
                className={[styles.payBtn, paying ? styles.payBtnPaying : ''].filter(Boolean).join(' ')}
                disabled={!selected}
                aria-busy={paying || undefined}
                onClick={() => {
                  if (!selected || paying) return;
                  setPaying(true);
                }}
              >
                {paying ? (
                  <span className={styles.paySpinner} aria-hidden="true">
                    <img src={ICON_SPINNER} alt="" width={17} height={17} />
                  </span>
                ) : null}
                {paying ? 'Переходим к оплате' : 'Перейти к оплате'}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </StudentLayout>
  );
}
