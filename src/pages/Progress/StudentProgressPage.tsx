import { useEffect, useId, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StudentLayout } from '../Home/StudentLayout';
import ICON_FLAG from '../../assets/icons/student/progress/flag.svg';
import ICON_FLAG_EMPTY from '../../assets/icons/student/progress/flag-empty.svg';
import ICON_RING from '../../assets/icons/student/progress/ring-arc.svg';
import ICON_TARGET from '../../assets/icons/student/progress/target.svg';
import ICON_TARGET_EMPTY from '../../assets/icons/student/progress/target-empty.svg';
import ICON_SKILL from '../../assets/icons/student/progress/skill.svg';
import ICON_CHECK from '../../assets/icons/student/progress/check.svg';
import ICON_CHART from '../../assets/icons/student/progress/chart.svg';
import ICON_CHART_EMPTY from '../../assets/icons/student/progress/chart-empty.svg';
import ICON_MESSAGE_EMPTY from '../../assets/icons/student/progress/message-empty.svg';
import ICON_LESSON from '../../assets/icons/student/lesson.svg';
import ICON_NOTE from '../../assets/icons/student/materials/note.svg';
import ICON_INFO from '../../assets/icons/student/booking/info-gray.svg';
import ICON_ARROW from '../../assets/icons/student/arrow.svg';
import ICON_ARROW_LITE from '../../assets/icons/student/arrow-lite.svg';
import PHOTO_IVAN from '../../assets/images/student/teachers/ivan-kozhevnikov.png';
import {
  DEFAULT_PERIOD,
  EMPTY_COPY,
  FOCUS_ITEMS,
  MONTHS,
  PERIOD_OPTIONS,
  RECS,
  SKILLS,
  STATS,
  type SkillTone,
} from './progressData';
import styles from './StudentProgressPage.module.css';

const REC_STEP = 326;

function EmptyState({
  icon,
  iconSize,
  iconClass,
  title,
  description,
}: {
  icon: string;
  iconSize: number;
  iconClass?: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.emptyState}>
      <span className={[styles.emptyIcon, iconClass ?? ''].filter(Boolean).join(' ')}>
        <img src={icon} alt="" width={iconSize} height={iconSize} />
      </span>
      <div className={styles.emptyText}>
        <p className={styles.emptyTitle}>{title}</p>
        <p className={styles.emptyDesc}>{description}</p>
      </div>
    </div>
  );
}

function badgeClass(tone: SkillTone): string {
  if (tone === 'info') return styles.badgeInfo;
  if (tone === 'warning') return styles.badgeWarning;
  return styles.badgeLime;
}

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

export function StudentProgressPage() {
  const [searchParams] = useSearchParams();
  const isEmpty = searchParams.get('empty') === '1';
  const [period, setPeriod] = useState<string>(DEFAULT_PERIOD);
  const [periodOpen, setPeriodOpen] = useState(false);
  const recsRef = useRef<HTMLDivElement>(null);

  const scrollRecs = (dir: -1 | 1) => {
    recsRef.current?.scrollBy({ left: dir * REC_STEP, behavior: 'smooth' });
  };

  return (
    <StudentLayout
      title="Прогресс"
      subtitle="Ваш результат и развитие"
      activeNav="progress"
      hideMobileSearch
    >
      <div className={[styles.layout, isEmpty ? styles.layoutEmpty : ''].filter(Boolean).join(' ')}>
        <section className={styles.goalCard} aria-label="Ближайшая цель">
          {isEmpty ? (
            <>
              <h2 className={styles.cardTitle}>Ближайшая цель</h2>
              <EmptyState
                icon={ICON_FLAG_EMPTY}
                iconSize={56}
                title={EMPTY_COPY.goalTitle}
                description={EMPTY_COPY.goalDesc}
              />
              <button type="button" className={styles.btnGoal}>
                {EMPTY_COPY.goalCta}
              </button>
            </>
          ) : (
            <>
              <div className={styles.goalTop}>
                <div className={styles.goalCopy}>
                  <h2 className={styles.cardTitle}>Ближайшая цель</h2>
                  <div className={styles.goalMeta}>
                    <div className={styles.levelRow}>
                      <p className={styles.levelCode}>B2+</p>
                      <p className={styles.levelName}>Upper-Intermediate+</p>
                    </div>
                    <p className={styles.stageRow}>
                      <span className={styles.muted}>Следующий этап:</span>
                      <span>
                        <span className={styles.stageAccent}>10-12 уроков</span> практики
                      </span>
                    </p>
                    <p className={styles.goalDesc}>
                      Научиться уверенно отвечать на возражения, сохранять структуру переговоров и
                      достигать взаимовыгодных решений.
                    </p>
                  </div>
                </div>
                <div className={styles.ring} aria-hidden="true">
                  <span className={styles.ringArc}>
                    <img src={ICON_RING} alt="" width={106} height={160} />
                  </span>
                  <img src={ICON_FLAG} alt="" width={56} height={56} />
                </div>
              </div>
              <div className={styles.focusCard}>
                <div className={styles.focusCopy}>
                  <h3 className={styles.focusTitle}>Фокус на ближайший период</h3>
                  <ul className={styles.focusList}>
                    {FOCUS_ITEMS.map((item) => (
                      <li key={item} className={styles.focusItem}>
                        <span className={styles.focusCheck}>
                          <img src={ICON_CHECK} alt="" width={17} height={17} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className={styles.focusIcon}>
                  <img src={ICON_TARGET} alt="" width={56} height={56} />
                </span>
              </div>
              <p className={styles.infoRow}>
                <span className={styles.infoIcon}>
                  <img src={ICON_INFO} alt="" width={17} height={17} />
                </span>
                <span>
                  <strong>Что влияет на прогресс: </strong>
                  регулярность занятий, домашние задания, обратная связь преподавателей.
                </span>
              </p>
            </>
          )}
        </section>

        <section className={styles.skillsCard} aria-label="Навыки по цели">
          <div className={styles.skillsHead}>
            <h2 className={styles.cardTitle}>Навыки по цели</h2>
            <p className={styles.skillsHint}>По оценке преподавателей и выполенным оценкам.</p>
          </div>
          {isEmpty ? (
            <EmptyState
              icon={ICON_TARGET_EMPTY}
              iconSize={70}
              iconClass={styles.emptyIconSkills}
              title={EMPTY_COPY.skillsTitle}
              description={EMPTY_COPY.skillsDesc}
            />
          ) : (
            <div className={styles.skillList}>
              {SKILLS.map((skill) => (
                <div key={skill.name} className={styles.skillRow}>
                  <div className={styles.skillHead}>
                    <div className={styles.skillName}>
                      <span className={styles.skillIcon}>
                        <img src={ICON_SKILL} alt="" width={28} height={28} />
                      </span>
                      {skill.name}
                    </div>
                    <span className={badgeClass(skill.tone)}>{skill.badge}</span>
                  </div>
                  <div className={styles.skillTrack} aria-hidden="true">
                    <span className={styles.skillFill} style={{ width: `${skill.fill}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.historyCard} aria-label="История прогресса">
          <div className={styles.historyHead}>
            <h2 className={styles.cardTitle}>История прогресса</h2>
            <PeriodSelect
              value={period}
              open={periodOpen}
              onToggle={() => setPeriodOpen((open) => !open)}
              onChange={setPeriod}
            />
          </div>
          <div className={styles.chartBlock}>
            <div className={styles.chartLevels}>
              {['100%', '75%', '50%', '25%', '0%'].map((label) => (
                <div key={label} className={styles.chartLevel}>
                  <span className={styles.chartLevelLabel}>{label}</span>
                  <span className={styles.chartLevelLine} />
                </div>
              ))}
            </div>
            <div className={styles.chartMonths}>
              <span className={styles.chartMonthSpacer} />
              {MONTHS.map((month) => (
                <span key={month} className={styles.chartMonth}>
                  {month}
                </span>
              ))}
            </div>
            <div className={styles.chartPlot}>
              {isEmpty ? null : <img src={ICON_CHART} alt="" className={styles.chartImage} />}
            </div>
            {isEmpty ? (
              <div className={styles.chartEmpty}>
                <EmptyState
                  icon={ICON_CHART_EMPTY}
                  iconSize={56}
                  iconClass={styles.emptyIconChart}
                  title={EMPTY_COPY.historyTitle}
                  description={EMPTY_COPY.historyDesc}
                />
              </div>
            ) : null}
          </div>
          <div className={styles.statRow}>
            {STATS.map((stat) => (
              <div key={stat.key} className={styles.statCard}>
                <span className={styles.statIcon}>
                  <img
                    src={stat.icon === 'lesson' ? ICON_LESSON : stat.icon === 'note' ? ICON_NOTE : ICON_CHECK}
                    alt=""
                    width={14}
                    height={14}
                  />
                </span>
                <div className={styles.statText}>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <p className={styles.statValue}>{isEmpty ? '0' : stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className={[styles.recsCard, isEmpty ? styles.recsCardEmpty : ''].filter(Boolean).join(' ')}
          aria-label="Рекомендации преподавателей"
        >
          <div className={styles.recsHead}>
            <h2 className={styles.cardTitle}>Рекомендации преподавателей</h2>
            {isEmpty ? null : (
              <div className={styles.recsNav}>
                <button type="button" className={styles.recsArrow} onClick={() => scrollRecs(-1)} aria-label="Назад">
                  <img src={ICON_ARROW} alt="" width={28} height={28} className={styles.recsArrowLeft} />
                </button>
                <button type="button" className={styles.recsArrow} onClick={() => scrollRecs(1)} aria-label="Вперёд">
                  <img src={ICON_ARROW} alt="" width={28} height={28} />
                </button>
              </div>
            )}
          </div>
          {isEmpty ? (
            <EmptyState
              icon={ICON_MESSAGE_EMPTY}
              iconSize={70}
              iconClass={styles.emptyIconMessage}
              title={EMPTY_COPY.recsTitle}
              description={EMPTY_COPY.recsDesc}
            />
          ) : (
            <div className={styles.recsTrack} ref={recsRef}>
              {RECS.map((rec) => (
                <article key={rec.id} className={styles.recCard}>
                  <div className={styles.recProfile}>
                    <img src={PHOTO_IVAN} alt="" className={styles.recPhoto} width={64} height={64} />
                    <div className={styles.recSummary}>
                      <h3 className={styles.recName}>{rec.name}</h3>
                      <p className={styles.recLesson}>
                        <span className={styles.muted}>Урок:</span>
                        <span>{rec.lesson}</span>
                      </p>
                    </div>
                  </div>
                  <div className={styles.recTags}>
                    {rec.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className={styles.recText}>{rec.text}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </StudentLayout>
  );
}
