import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { clearSession } from '../../shared/auth/mockAuth';
import styles from './AdminDashboard.module.css';

import LOGO_COMPACT from '../../assets/icons/admin/05f06da7-da57-4718-bf22-90a176ac3523.svg';
import LOGO_FULL from '../../assets/icons/admin/326a0b15-9c90-411c-8b53-3c1d538d3da9.svg';
import ICON_HOME from '../../assets/icons/admin/734d5e33-5e2d-4a6a-a1ea-a956aed5984d.svg';
import ICON_USERS from '../../assets/icons/admin/ddbf7ea0-8bd0-4175-88a3-d7706f401df7.svg';
import ICON_LESSONS from '../../assets/icons/admin/350ef0ca-32e0-46cf-bc47-2f1b28d93ade.svg';
import ICON_FINANCE from '../../assets/icons/admin/6d1ac038-b3de-4db1-abcf-da4ccd1fa4b7.svg';
import ICON_EXIT from '../../assets/icons/admin/0156cecf-0b9d-448b-8e1e-62c6859c6fc3.svg';
import ICON_NOTIFICATION from '../../assets/icons/admin/40f79c9c-cae5-474f-931e-464f5a9dae78.svg';
import ICON_CHEVRON from '../../assets/icons/admin/dbe9bd54-fd9c-4a89-a289-98950ea9cffa.svg';
import ICON_ARROW_LITE from '../../assets/icons/admin/54d8478d-9c9c-4d10-9994-6672d0a79b28.svg';
import ICON_ARROW_UP from '../../assets/icons/admin/afb401c0-3272-42fa-83e1-29490ce7fd87.svg';
import ICON_ARROW_DOWN from '../../assets/icons/admin/22612eb9-3f32-4529-8764-bb0da33c1229.svg';
import AVATAR from '../../assets/images/admin/da13fe3f-3c26-4838-9f87-50e819b11e60.png';
import ICON_DAU from '../../assets/icons/admin/f01d9e0c-576f-4b61-bdd4-2d80275a1cf5.svg';
import ICON_MAU from '../../assets/icons/admin/ef1eb6b7-ce69-4080-bd0d-0eda21f16a39.svg';
import ICON_CALENDAR from '../../assets/icons/admin/ba9dc50f-0ef9-43b6-a691-a22eaadd1511.svg';
import ICON_RUBLE from '../../assets/icons/admin/e0dbca4e-dc81-469c-b182-e29565f571a3.svg';
import ICON_CONVERSION from '../../assets/icons/admin/fb05fb0e-784e-43fe-ae25-46d9a1795a0c.svg';
import ICON_RETENTION from '../../assets/icons/admin/c3f91f42-290c-4dc4-b47c-99910838c0ba.svg';
import ICON_ACTIVE_STUDENTS from '../../assets/icons/admin/49ed47c0-d0a1-430a-a03b-673caf5fd0a1.svg';
import ICON_TEACHERS from '../../assets/icons/admin/cb74daba-a3f2-4069-ad0d-74b914ff935f.svg';
import ICON_CANCELLED from '../../assets/icons/admin/5a06d294-1ea1-4969-b5dd-5a26aa639a56.svg';
import ICON_ABSENCES from '../../assets/icons/admin/7fcc4c18-7d3c-48cc-8d59-a73668a6b9ea.svg';
import ICON_LOW_BALANCE from '../../assets/icons/admin/780525bf-ca9c-4136-8173-c3db9ebbf14d.svg';
import ICON_ALERTS from '../../assets/icons/admin/8b24da02-f309-4d0a-ba59-5f2a3a06cc1c.svg';
import MOBILE_SEARCH from '../../assets/icons/admin/65b4459a-5ce1-4b4e-804f-bc19196194ee.svg';
import MOBILE_AVATAR from '../../assets/images/admin/abfd45ff-f19a-4cda-b003-ba4e8f05fe56.png';
import MOBILE_ARROW_LITE from '../../assets/icons/admin/e640fd85-be49-4eec-b7f7-0248364d156e.svg';
import MOBILE_ICON_HOME from '../../assets/icons/admin/c87f92f3-d0a2-417b-bc56-7fe57c84693a.svg';
import MOBILE_ICON_USERS from '../../assets/icons/admin/11d24a82-2cc3-49e3-a1d9-bbb46beda238.svg';
import MOBILE_ICON_LESSONS from '../../assets/icons/admin/e9c6ab6f-81c4-4be0-ac22-90f0382426a1.svg';
import MOBILE_ICON_FINANCE from '../../assets/icons/admin/47ab14b6-6f95-4839-8c25-b62c1aa4d669.svg';
import ICON_EMPTY_CHART from '../../assets/icons/admin/empty-chart.svg';
import ICON_CHART_LOADING from '../../assets/icons/admin/chart-loading.svg';
import ICON_CHART_LOADING_MOBILE from '../../assets/icons/admin/chart-loading-mobile.svg';

const ADMIN_NAME = 'Пётр Васильев';

type TileTone = 'positive' | 'negative';

type MetricTileData = {
  iconSrc: string;
  iconAlt: string;
  label: string;
  value: string;
  tone: TileTone;
};

const LEFT_TILES: MetricTileData[] = [
  { iconSrc: ICON_DAU, iconAlt: '', label: 'DAU', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_MAU, iconAlt: '', label: 'MAU', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_CALENDAR, iconAlt: '', label: 'Уроков в неделю', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_RUBLE, iconAlt: '', label: 'Выручка за месяц', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_CONVERSION, iconAlt: '', label: 'Конверсия', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_RETENTION, iconAlt: '', label: 'Retention (7 дней)', value: '12 842', tone: 'positive' },
];

const RIGHT_TILES: MetricTileData[] = [
  { iconSrc: ICON_ACTIVE_STUDENTS, iconAlt: '', label: 'Активные студенты', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_TEACHERS, iconAlt: '', label: 'Преподаватели', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_CANCELLED, iconAlt: '', label: 'Отменённые уроки', value: '12 842', tone: 'negative' },
  { iconSrc: ICON_ABSENCES, iconAlt: '', label: 'Неявки', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_LOW_BALANCE, iconAlt: '', label: 'Низкий баланс', value: '12 842', tone: 'positive' },
  { iconSrc: ICON_ALERTS, iconAlt: '', label: 'Системные алерты', value: '12 842', tone: 'positive' },
];

const AXIS_LABELS = ['11', '18', '25', '1', '8', '15', '22', '29'];

type LessonChartPoint = {
  xLabel: string;
  value: number;
};

const LESSON_CHART_MIN = 0;
const LESSON_CHART_MAX = 500;
const LESSON_CHART_TOP_PAD_PX = 14;
const LESSON_CHART_LEVELS = [500, 375, 250, 125, 0] as const;
const LESSON_CHART_STROKE = '#A3C619';
const LESSON_CHART_FILL_TOP = '#C7F21A';
const LESSON_CHART_FILL_BOTTOM = '#FFFFFF';
const LESSON_CHART_FILL_OPACITY = 0.24;

const DESKTOP_CHART_REF_HEIGHT = 302;
const DESKTOP_CHART_DOTS = [
  { left: 71, top: 239 },
  { left: 217, top: 220 },
  { left: 370, top: 164 },
  { left: 512, top: 168 },
  { left: 659, top: 89 },
  { left: 793, top: 119 },
  { left: 946, top: 28 },
  { left: 1104, top: 10 },
] as const;

const MOBILE_CHART_POINT_X_RATIO = [0.066, 0.179, 0.323, 0.424, 0.525, 0.634, 0.778, 0.899] as const;

function getLessonChartMockData(): LessonChartPoint[] {
  const values = DESKTOP_CHART_DOTS.map((dot) => {
    const cy = dot.top + 4;
    const t = (cy - LESSON_CHART_TOP_PAD_PX) / (DESKTOP_CHART_REF_HEIGHT - LESSON_CHART_TOP_PAD_PX);
    return Math.round(LESSON_CHART_MAX * (1 - t));
  });

  return AXIS_LABELS.map((xLabel, index) => ({
    xLabel,
    value: values[index] ?? LESSON_CHART_MIN,
  }));
}

function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, [ref]);

  return size;
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';

  const d: string[] = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`);
  }

  return d.join(' ');
}

function ChartEmptyState({ compact = false }: { compact?: boolean }) {
  const iconBox = compact ? 64 : 80;
  const iconSize = compact ? 44.8 : 56;

  return (
    <div className={styles.chartEmpty}>
      <div className={styles.chartEmptyIcon} style={{ width: iconBox, height: iconBox }}>
        <img src={ICON_EMPTY_CHART} alt="" width={iconSize} height={iconSize} />
      </div>
      <div className={styles.chartEmptyText}>
        <p className={styles.chartEmptyTitle}>Данных пока нет</p>
        <p className={styles.chartEmptyDesc}>Метрики появятся после активности на платформе.</p>
      </div>
    </div>
  );
}

const CHART_LOADING_LEVELS = 6;

function ChartLoadingSkeleton({ variant }: { variant: 'desktop' | 'mobile' }) {
  const wrapClass = variant === 'mobile' ? styles.mobileChartWrap : styles.chartWrap;
  const levelsClass = variant === 'mobile' ? styles.mobileChartLevels : styles.chartLevels;
  const plotClass = variant === 'mobile' ? styles.mobileChartPlot : styles.chartPlot;
  const axisClass = variant === 'mobile' ? styles.mobileChartAxis : styles.chartAxis;
  const spacerClass = variant === 'mobile' ? styles.mobileChartAxisSpacer : styles.chartAxisSpacer;
  const chartSrc = variant === 'mobile' ? ICON_CHART_LOADING_MOBILE : ICON_CHART_LOADING;

  return (
    <div className={wrapClass} aria-busy="true" aria-label="Загрузка графика">
      <div className={levelsClass}>
        {Array.from({ length: CHART_LOADING_LEVELS }, (_, index) => (
          <div key={index} className={styles.chartLevel}>
            <span className={styles.chartLevelPlug} />
            <span className={styles.chartLevelLine} />
          </div>
        ))}
      </div>

      <div className={plotClass}>
        <img src={chartSrc} alt="" className={styles.chartLoadingFill} />
      </div>

      <div className={axisClass}>
        <span className={spacerClass} />
        <div className={styles.chartAxisPlugs}>
          {AXIS_LABELS.map((label) => (
            <span key={label} className={styles.chartAxisPlugSlot}>
              <span className={styles.chartAxisPlug} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopLessonChart({ isEmpty, isLoading }: { isEmpty: boolean; isLoading: boolean }) {
  const plotRef = useRef<HTMLDivElement | null>(null);
  const plotSize = useElementSize(plotRef);

  const plotWidth = plotSize.width;
  const plotHeight = plotSize.height;
  const canDraw = !isEmpty && !isLoading && plotWidth > 0 && plotHeight > LESSON_CHART_TOP_PAD_PX;
  const scaleY = canDraw ? plotHeight / DESKTOP_CHART_REF_HEIGHT : 0;

  const figXs = DESKTOP_CHART_DOTS.map((dot) => dot.left + 4);
  const figXMin = figXs[0] ?? 0;
  const figXMax = figXs[figXs.length - 1] ?? 1;
  const xMin = 4;
  const xMax = Math.max(xMin + 1, plotWidth - 4);

  const points = canDraw
    ? DESKTOP_CHART_DOTS.map((dot, index) => {
        const figX = figXs[index] ?? figXMin;
        const x = xMin + ((figX - figXMin) / (figXMax - figXMin)) * (xMax - xMin);
        const y = (dot.top + 4) * scaleY;
        return { x, y };
      })
    : [];

  const pathPoints = canDraw ? [{ x: 0, y: plotHeight }, ...points] : [];
  const lineD = canDraw ? buildSmoothPath(pathPoints) : '';
  const areaD = canDraw
    ? `${lineD} L ${pathPoints[pathPoints.length - 1].x} ${plotHeight} L 0 ${plotHeight} Z`
    : '';

  return (
    <>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Уроки по дням</h2>
        <PeriodSelect />
      </div>

      {isLoading ? (
        <ChartLoadingSkeleton variant="desktop" />
      ) : isEmpty ? (
        <ChartEmptyState />
      ) : (
        <div className={styles.chartWrap}>
          <div className={styles.chartLevels}>
            {LESSON_CHART_LEVELS.map((level) => (
              <div key={level} className={styles.chartLevel}>
                <span className={styles.chartLevelLabel}>{Math.round((level / LESSON_CHART_MAX) * 100)}%</span>
                <span className={styles.chartLevelLine} />
              </div>
            ))}
          </div>

          <div className={styles.chartPlot} ref={plotRef}>
            {canDraw ? (
              <svg
                className={styles.chartSvg}
                width={plotWidth}
                height={plotHeight}
                viewBox={`0 0 ${plotWidth} ${plotHeight}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="lessonChartGradDesktop"
                    x1="0"
                    y1={LESSON_CHART_TOP_PAD_PX * scaleY}
                    x2="0"
                    y2={plotHeight}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor={LESSON_CHART_FILL_TOP} />
                    <stop offset="1" stopColor={LESSON_CHART_FILL_BOTTOM} />
                  </linearGradient>
                </defs>
                <path d={areaD} fill="url(#lessonChartGradDesktop)" fillOpacity={LESSON_CHART_FILL_OPACITY} />
                <path
                  d={lineD}
                  fill="none"
                  stroke={LESSON_CHART_STROKE}
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {points.map((pt, index) => (
                  <circle key={index} cx={pt.x} cy={pt.y} r={4} fill={LESSON_CHART_STROKE} />
                ))}
              </svg>
            ) : null}
          </div>

          <div className={styles.chartAxis}>
            <span className={styles.chartAxisSpacer} />
            <div className={styles.chartAxisTrack}>
              {AXIS_LABELS.map((label, index) => {
                const left = canDraw && points[index] ? (points[index].x / plotWidth) * 100 : ((index + 0.5) / AXIS_LABELS.length) * 100;
                return (
                  <span key={label} className={styles.chartAxisLabel} style={{ left: `${left}%` }}>
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileLessonChart({ isEmpty, isLoading }: { isEmpty: boolean; isLoading: boolean }) {
  const plotRef = useRef<HTMLDivElement | null>(null);
  const plotSize = useElementSize(plotRef);

  const data = getLessonChartMockData();
  const plotWidth = plotSize.width;
  const plotHeight = plotSize.height;
  const canDraw = !isEmpty && !isLoading && plotWidth > 0 && plotHeight > LESSON_CHART_TOP_PAD_PX;

  if (isLoading) {
    return <ChartLoadingSkeleton variant="mobile" />;
  }

  if (isEmpty) {
    return <ChartEmptyState compact />;
  }

  const topPad = LESSON_CHART_TOP_PAD_PX;
  const usableH = Math.max(0, plotHeight - topPad);
  const figXs = MOBILE_CHART_POINT_X_RATIO.map((ratio) => ratio * 1000);
  const figXMin = figXs[0] ?? 0;
  const figXMax = figXs[figXs.length - 1] ?? 1;
  const xMin = 4;
  const xMax = Math.max(xMin + 1, plotWidth - 4);

  const points = canDraw
    ? data.map((p, index) => {
        const figX = figXs[index] ?? figXMin;
        const x = xMin + ((figX - figXMin) / (figXMax - figXMin)) * (xMax - xMin);
        const t = (LESSON_CHART_MAX - p.value) / (LESSON_CHART_MAX - LESSON_CHART_MIN);
        const y = topPad + t * usableH;
        return { x, y };
      })
    : [];

  const pathPoints = canDraw ? [{ x: 0, y: plotHeight }, ...points] : [];
  const lineD = canDraw ? buildSmoothPath(pathPoints) : '';
  const areaD = canDraw
    ? `${lineD} L ${pathPoints[pathPoints.length - 1].x} ${plotHeight} L 0 ${plotHeight} Z`
    : '';

  return (
    <div className={styles.mobileChartWrap}>
      <div className={styles.mobileChartLevels}>
        {LESSON_CHART_LEVELS.map((level) => (
          <div key={level} className={styles.chartLevel}>
            <span className={styles.mobileChartLevelLabel}>{Math.round((level / LESSON_CHART_MAX) * 100)}%</span>
            <span className={styles.chartLevelLine} />
          </div>
        ))}
      </div>

      <div className={styles.mobileChartPlot} ref={plotRef}>
        {canDraw ? (
          <svg
            className={styles.chartSvg}
            width={plotWidth}
            height={plotHeight}
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="lessonChartGradMobile"
                x1="0"
                y1={topPad}
                x2="0"
                y2={plotHeight}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor={LESSON_CHART_FILL_TOP} />
                <stop offset="1" stopColor={LESSON_CHART_FILL_BOTTOM} />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#lessonChartGradMobile)" fillOpacity={LESSON_CHART_FILL_OPACITY} />
            <path
              d={lineD}
              fill="none"
              stroke={LESSON_CHART_STROKE}
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {points.map((pt, index) => (
              <circle key={index} cx={pt.x} cy={pt.y} r={2} fill={LESSON_CHART_STROKE} />
            ))}
          </svg>
        ) : null}
      </div>

      <div className={styles.mobileChartAxis}>
        <span className={styles.mobileChartAxisSpacer} />
        <div className={styles.chartAxisTrack}>
          {AXIS_LABELS.map((label, index) => {
            const left =
              canDraw && points[index] ? (points[index].x / plotWidth) * 100 : ((index + 0.5) / AXIS_LABELS.length) * 100;
            return (
              <span key={label} className={styles.chartAxisLabel} style={{ left: `${left}%` }}>
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PERIOD_OPTIONS = ['Последние 30 дней', 'Последние 100 дней'] as const;
type PeriodOption = (typeof PERIOD_OPTIONS)[number];

function PeriodSelect({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<PeriodOption>(PERIOD_OPTIONS[0]);
  const triggerClass = variant === 'mobile' ? styles.mobileSelect : styles.select;
  const arrowSrc = variant === 'mobile' ? MOBILE_ARROW_LITE : ICON_ARROW_LITE;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.selectWrap} ref={rootRef}>
      <button
        type="button"
        className={[triggerClass, open ? styles.selectOpen : ''].filter(Boolean).join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value}</span>
        <span className={[styles.selectIcon, open ? styles.selectIconOpen : ''].filter(Boolean).join(' ')}>
          <img src={arrowSrc} alt="" width={14} height={14} />
        </span>
      </button>
      {open ? (
        <ul id={listId} className={styles.selectDropdown} role="listbox" aria-label="Период">
          {PERIOD_OPTIONS.map((option) => {
            const selected = option === value;
            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[styles.selectOption, selected ? styles.selectOptionSelected : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    setValue(option);
                    setOpen(false);
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

function SidebarItem({
  icon,
  label,
  to,
  active = false,
  onClick,
}: {
  icon: string;
  label: string;
  to?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const className = [styles.sidebarItem, active ? styles.sidebarItemActive : ''].filter(Boolean).join(' ');
  const content = (
    <>
      <span className={styles.sidebarIconWrap}>
        <img src={icon} alt="" width={22.4} height={22.4} />
      </span>
      <span className={styles.sidebarLabel}>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className} aria-current={active ? 'page' : undefined} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} aria-label={label} onClick={onClick}>
      {content}
    </button>
  );
}

function MetricTileSkeleton() {
  return (
    <article className={styles.metricTile} aria-hidden>
      <span className={styles.metricPlugIcon} />
      <div className={styles.metricText}>
        <span className={styles.metricPlugLabel} />
        <span className={styles.metricPlugValue} />
        <span className={styles.metricPlugDelta} />
      </div>
      <span className={styles.metricPlugFootnote} />
    </article>
  );
}

function MetricTile({ tile, isEmpty = false }: { tile: MetricTileData; isEmpty?: boolean }) {
  const positive = tile.tone === 'positive';

  return (
    <article className={styles.metricTile}>
      <span className={styles.metricIconWrap}>
        <img src={tile.iconSrc} alt={tile.iconAlt} width={28} height={28} />
      </span>
      <div className={styles.metricText}>
        <span className={styles.metricLabel}>{tile.label}</span>
        <span className={styles.metricValue}>{isEmpty ? '–' : tile.value}</span>
        {!isEmpty ? (
          <span
            className={[styles.metricDelta, positive ? styles.metricDeltaPositive : styles.metricDeltaNegative]
              .filter(Boolean)
              .join(' ')}
          >
            <span className={styles.metricArrowWrap}>
              <img
                src={positive ? ICON_ARROW_UP : ICON_ARROW_DOWN}
                alt=""
                width={11.2}
                height={11.2}
                className={positive ? styles.metricArrowPositive : styles.metricArrowNegative}
              />
            </span>
            <span>8,2%</span>
          </span>
        ) : null}
      </div>
      <span className={styles.metricFootnote}>
        <span className={styles.metricFootnoteLine}>vs предыдущие</span>
        <span className={styles.metricFootnoteLine}>30 дней</span>
      </span>
    </article>
  );
}

function MetricsCard({
  tiles,
  isEmpty = false,
  isLoading = false,
}: {
  tiles: MetricTileData[];
  isEmpty?: boolean;
  isLoading?: boolean;
}) {
  return (
    <section className={styles.metricsCard} aria-busy={isLoading || undefined}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Ключевые показатели</h2>
        <PeriodSelect />
      </div>
      <div className={styles.metricsGrid}>
        {isLoading
          ? tiles.map((tile) => <MetricTileSkeleton key={tile.label} />)
          : tiles.map((tile) => <MetricTile key={tile.label} tile={tile} isEmpty={isEmpty} />)}
      </div>
    </section>
  );
}

function MobileSearchField() {
  return (
    <label className={styles.mobileSearch}>
      <span className={styles.mobileSearchIcon}>
        <img src={MOBILE_SEARCH} alt="" width={14} height={14} />
      </span>
      <input type="search" placeholder="Поиск по материалам и урокам" aria-label="Поиск по материалам и урокам" />
    </label>
  );
}

function MobileBottomNav() {
  const items: Array<{ icon: string; label: string; to?: string; active: boolean }> = [
    { icon: MOBILE_ICON_HOME, label: 'Главная', to: '/home', active: true },
    { icon: MOBILE_ICON_USERS, label: 'Пользователи', to: '/users', active: false },
    { icon: MOBILE_ICON_LESSONS, label: 'Уроки', to: '/lessons', active: false },
    { icon: MOBILE_ICON_FINANCE, label: 'Финансы', to: '/finance', active: false },
  ];

  return (
    <nav className={styles.mobileBottomNav} aria-label="Мобильная навигация">
      {items.map((item) => {
        const className = [styles.mobileBottomItem, item.active ? styles.mobileBottomItemActive : '']
          .filter(Boolean)
          .join(' ');
        const content = (
          <>
            <span className={styles.mobileBottomIcon}>
              <img src={item.icon} alt="" width={22.4} height={22.4} />
            </span>
            <span className={styles.mobileBottomLabel}>{item.label}</span>
          </>
        );

        if (item.to) {
          return (
            <Link key={item.label} to={item.to} className={className} aria-current={item.active ? 'page' : undefined}>
              {content}
            </Link>
          );
        }

        return (
          <button key={item.label} type="button" className={className}>
            {content}
          </button>
        );
      })}
    </nav>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoading = searchParams.get('loading') === '1';
  const isEmpty = !isLoading && searchParams.get('empty') === '1';

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="Навигация">
          <div className={styles.logoWrap}>
            <img src={LOGO_COMPACT} alt="" className={styles.logoCompact} width={37.787} height={25.532} />
            <img src={LOGO_FULL} alt="EngLab" className={styles.logoFull} width={109.769} height={27.377} />
          </div>
          <div className={styles.sidebarBody}>
            <div className={styles.sidebarTop}>
              <SidebarItem icon={ICON_HOME} label="Главная" to="/home" active />
              <SidebarItem icon={ICON_USERS} label="Пользователи" to="/users" />
              <SidebarItem icon={ICON_LESSONS} label="Уроки" to="/lessons" />
              <SidebarItem icon={ICON_FINANCE} label="Финансы" to="/finance" />
            </div>
            <div className={styles.sidebarBottom}>
              <div className={styles.sidebarSpacer} />
              <SidebarItem icon={ICON_EXIT} label="Выйти" onClick={handleLogout} />
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.headingWrap}>
              <h1 className={styles.pageTitle}>Обзор админ-панели</h1>
              <p className={styles.pageSubtitle}>Ключевые показатели и&nbsp;состояние бизнеса</p>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.notificationButton} aria-label="Уведомления">
                <span className={styles.notificationIcon}>
                  <img src={ICON_NOTIFICATION} alt="" width={22.4} height={22.4} />
                </span>
              </button>

              <button type="button" className={styles.userChip} aria-label={ADMIN_NAME}>
                <span className={styles.userProfile}>
                  <img src={AVATAR} alt="" className={styles.avatar} width={32} height={32} />
                  <span className={styles.userName}>{ADMIN_NAME}</span>
                </span>
                <span className={styles.chevronWrap}>
                  <img src={ICON_CHEVRON} alt="" width={9} height={5} />
                </span>
              </button>

              <button type="button" className={styles.mobileAvatarButton} aria-label={ADMIN_NAME}>
                <img src={MOBILE_AVATAR} alt="" width={32} height={32} className={styles.mobileAvatarImage} />
              </button>
            </div>
          </header>

          <MobileSearchField />

          <div className={styles.content}>
            <div className={styles.metricsRow}>
              <MetricsCard tiles={LEFT_TILES} isEmpty={isEmpty} isLoading={isLoading} />
              <MetricsCard tiles={RIGHT_TILES} isEmpty={isEmpty} isLoading={isLoading} />
            </div>

            <section className={styles.chartCard}>
              <DesktopLessonChart isEmpty={isEmpty} isLoading={isLoading} />
            </section>

            <section className={styles.mobileChartCard}>
              <div className={styles.mobileChartHeader}>
                <h2 className={styles.cardTitle}>Уроки по дням</h2>
                <PeriodSelect variant="mobile" />
              </div>

              <MobileLessonChart isEmpty={isEmpty} isLoading={isLoading} />
            </section>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

