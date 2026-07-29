import { useMemo, useState } from 'react';
import { Button } from '../../components/ui';
import { t } from '../../shared/i18n';
import iconClose from '../../assets/icons/modal-close.svg';
import iconArrowLite from '../../assets/icons/arrow-lite.svg';
import iconBusiness from '../../assets/icons/onboarding/business-communication.svg';
import iconDay from '../../assets/icons/onboarding/day.svg';
import iconEvening from '../../assets/icons/onboarding/evening.svg';
import iconExam from '../../assets/icons/onboarding/exam-prep.svg';
import iconFlag from '../../assets/icons/onboarding/flag.svg';
import iconInterview from '../../assets/icons/onboarding/interview.svg';
import iconMorning from '../../assets/icons/onboarding/morning.svg';
import iconProgress from '../../assets/icons/onboarding/progress.svg';
import iconSpeaking from '../../assets/icons/onboarding/speaking-practice.svg';
import iconTime from '../../assets/icons/onboarding/time.svg';
import iconTravel from '../../assets/icons/onboarding/travel.svg';
import styles from './OnboardingModal.module.css';

export type LearningGoalId = 'speaking' | 'business' | 'travel' | 'interview' | 'exam';
export type LevelId = 'a1' | 'a2' | 'b1' | 'b1plus' | 'b2' | 'c1' | 'c2';
export type TimeSlotId = 'morning' | 'day' | 'evening';
export type TimezoneId = 'utc3' | 'utc2' | 'utc4' | 'utc5' | 'utc6';

export type OnboardingAnswers = {
  goal: LearningGoalId;
  level: LevelId;
  timezone: TimezoneId;
  timeSlot: TimeSlotId;
};

type OnboardingModalProps = {
  onClose: () => void;
  onComplete: (answers: OnboardingAnswers) => void;
};

type Step = 1 | 2 | 3 | 4;

const GOAL_OPTIONS = [
  {
    id: 'speaking' as const,
    title: t.onboarding.goals.speaking.title,
    description: t.onboarding.goals.speaking.description,
    icon: iconSpeaking,
  },
  {
    id: 'business' as const,
    title: t.onboarding.goals.business.title,
    description: t.onboarding.goals.business.description,
    icon: iconBusiness,
  },
  {
    id: 'travel' as const,
    title: t.onboarding.goals.travel.title,
    description: t.onboarding.goals.travel.description,
    icon: iconTravel,
  },
  {
    id: 'interview' as const,
    title: t.onboarding.goals.interview.title,
    description: t.onboarding.goals.interview.description,
    icon: iconInterview,
  },
  {
    id: 'exam' as const,
    title: t.onboarding.goals.exam.title,
    description: t.onboarding.goals.exam.description,
    icon: iconExam,
  },
];

const LEVEL_OPTIONS = [
  {
    id: 'a1' as const,
    code: t.onboarding.levels.a1.code,
    title: t.onboarding.levels.a1.title,
    description: t.onboarding.levels.a1.description,
  },
  {
    id: 'a2' as const,
    code: t.onboarding.levels.a2.code,
    title: t.onboarding.levels.a2.title,
    description: t.onboarding.levels.a2.description,
  },
  {
    id: 'b1' as const,
    code: t.onboarding.levels.b1.code,
    title: t.onboarding.levels.b1.title,
    description: t.onboarding.levels.b1.description,
  },
  {
    id: 'b1plus' as const,
    code: t.onboarding.levels.b1plus.code,
    title: t.onboarding.levels.b1plus.title,
    description: t.onboarding.levels.b1plus.description,
  },
  {
    id: 'b2' as const,
    code: t.onboarding.levels.b2.code,
    title: t.onboarding.levels.b2.title,
    description: t.onboarding.levels.b2.description,
  },
  {
    id: 'c1' as const,
    code: t.onboarding.levels.c1.code,
    title: t.onboarding.levels.c1.title,
    description: t.onboarding.levels.c1.description,
  },
  {
    id: 'c2' as const,
    code: t.onboarding.levels.c2.code,
    title: t.onboarding.levels.c2.title,
    description: t.onboarding.levels.c2.description,
  },
];

const TIMEZONE_OPTIONS = [
  { id: 'utc2' as const, label: t.onboarding.timezones.utc2 },
  { id: 'utc3' as const, label: t.onboarding.timezones.utc3 },
  { id: 'utc4' as const, label: t.onboarding.timezones.utc4 },
  { id: 'utc5' as const, label: t.onboarding.timezones.utc5 },
  { id: 'utc6' as const, label: t.onboarding.timezones.utc6 },
];

const TIME_SLOT_OPTIONS = [
  {
    id: 'morning' as const,
    title: t.onboarding.timeSlots.morning.title,
    description: t.onboarding.timeSlots.morning.description,
    icon: iconMorning,
  },
  {
    id: 'day' as const,
    title: t.onboarding.timeSlots.day.title,
    description: t.onboarding.timeSlots.day.description,
    icon: iconDay,
  },
  {
    id: 'evening' as const,
    title: t.onboarding.timeSlots.evening.title,
    description: t.onboarding.timeSlots.evening.description,
    icon: iconEvening,
  },
];

export function OnboardingModal({ onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [goal, setGoal] = useState<LearningGoalId>('speaking');
  const [level, setLevel] = useState<LevelId>('a1');
  const [timezone, setTimezone] = useState<TimezoneId>('utc3');
  const [timeSlot, setTimeSlot] = useState<TimeSlotId>('morning');

  const header = useMemo(() => {
    switch (step) {
      case 1:
        return { title: t.onboarding.step1Title, stepLabel: t.onboarding.step1 };
      case 2:
        return { title: t.onboarding.step2Title, stepLabel: t.onboarding.step2 };
      case 3:
        return { title: t.onboarding.step3Title, stepLabel: t.onboarding.step3 };
      case 4:
        return { title: t.onboarding.step4Title, stepLabel: t.onboarding.step4 };
    }
  }, [step]);

  const selectedGoal = GOAL_OPTIONS.find((option) => option.id === goal)!;
  const selectedLevel = LEVEL_OPTIONS.find((option) => option.id === level)!;
  const selectedTimezone = TIMEZONE_OPTIONS.find((option) => option.id === timezone)!;
  const selectedTimeSlot = TIME_SLOT_OPTIONS.find((option) => option.id === timeSlot)!;

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  const handleContinue = () => {
    if (step < 4) {
      setStep((prev) => ((prev + 1) as Step));
      return;
    }

    onComplete({ goal, level, timezone, timeSlot });
  };

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 id="onboarding-title" className={styles.title}>
              {header.title}
            </h2>
            <p className={styles.step}>{header.stepLabel}</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t.onboarding.close}
          >
            <img src={iconClose} alt="" width={22} height={22} />
          </button>
        </div>

        <div className={styles.content}>
          {step === 1 ? (
            <>
              <div className={styles.questionBlock}>
                <p className={styles.question}>{t.onboarding.question}</p>
                <p className={styles.questionHint}>{t.onboarding.questionHint}</p>
              </div>

              <div className={styles.options} role="radiogroup" aria-label={t.onboarding.question}>
                {GOAL_OPTIONS.map((option) => {
                  const isSelected = goal === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={[
                        styles.option,
                        styles.optionGoal,
                        isSelected ? styles.optionSelected : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setGoal(option.id)}
                    >
                      <span className={styles.optionContent}>
                        <span className={styles.optionIcon}>
                          <img src={option.icon} alt="" width={28} height={28} />
                        </span>
                        <span className={styles.optionText}>
                          <span className={styles.optionTitle}>{option.title}</span>
                          <span className={styles.optionDescription}>{option.description}</span>
                        </span>
                      </span>
                      <RadioMark selected={isSelected} />
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className={styles.questionBlock}>
                <p className={styles.question}>{t.onboarding.levelQuestion}</p>
                <p className={styles.questionHint}>{t.onboarding.levelHint}</p>
              </div>

              <div className={styles.options} role="radiogroup" aria-label={t.onboarding.levelQuestion}>
                {LEVEL_OPTIONS.map((option) => {
                  const isSelected = level === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={[
                        styles.option,
                        styles.optionLevel,
                        isSelected ? styles.optionSelected : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setLevel(option.id)}
                    >
                      <span className={styles.optionContent}>
                        <span className={styles.levelCode}>{option.code}</span>
                        <span className={styles.optionText}>
                          <span className={styles.optionTitle}>{option.title}</span>
                          <span className={styles.optionDescription}>{option.description}</span>
                        </span>
                      </span>
                      <RadioMark selected={isSelected} />
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className={styles.section}>
                <div className={styles.questionBlock}>
                  <p className={styles.question}>{t.onboarding.timezoneTitle}</p>
                  <p className={styles.questionHint}>{t.onboarding.timezoneHint}</p>
                </div>

                <label className={styles.selectWrap}>
                  <span className={styles.srOnly}>{t.onboarding.timezoneTitle}</span>
                  <select
                    className={styles.select}
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value as TimezoneId)}
                  >
                    {TIMEZONE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className={styles.selectIcon} aria-hidden="true">
                    <img src={iconArrowLite} alt="" width={14} height={14} />
                  </span>
                </label>
              </div>

              <div className={styles.section}>
                <div className={styles.questionBlock}>
                  <p className={styles.question}>{t.onboarding.timeSlotTitle}</p>
                  <p className={styles.questionHint}>{t.onboarding.timeSlotHint}</p>
                </div>

                <div
                  className={styles.options}
                  role="radiogroup"
                  aria-label={t.onboarding.timeSlotTitle}
                >
                  {TIME_SLOT_OPTIONS.map((option) => {
                    const isSelected = timeSlot === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={[
                          styles.option,
                          styles.optionTime,
                          isSelected ? styles.optionSelected : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => setTimeSlot(option.id)}
                      >
                        <span className={styles.optionContent}>
                          <span className={styles.optionIcon}>
                            <img src={option.icon} alt="" width={28} height={28} />
                          </span>
                          <span className={styles.optionText}>
                            <span className={styles.optionTitle}>{option.title}</span>
                            <span className={styles.optionDescription}>{option.description}</span>
                          </span>
                        </span>
                        <RadioMark selected={isSelected} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <div className={styles.questionBlock}>
                <p className={styles.question}>{t.onboarding.readyTitle}</p>
                <p className={styles.questionHint}>{t.onboarding.readyHint}</p>
              </div>

              <div className={styles.summaryGrid}>
                <SummaryCard
                  icon={iconFlag}
                  label={t.onboarding.summary.goal}
                  value={selectedGoal.title}
                />
                <SummaryCard
                  icon={iconProgress}
                  label={t.onboarding.summary.level}
                  value={selectedLevel.code}
                />
                <SummaryCard
                  icon={iconTime}
                  label={t.onboarding.summary.timezone}
                  value={selectedTimezone.label}
                />
                <SummaryCard
                  icon={selectedTimeSlot.icon}
                  label={t.onboarding.summary.timeSlot}
                  value={`${selectedTimeSlot.title} (${selectedTimeSlot.description})`}
                />
              </div>
            </>
          ) : null}
        </div>

        {step === 1 || step === 4 ? (
          <Button
            type="button"
            variant="primary"
            fullWidth
            className={styles.continueButton}
            onClick={handleContinue}
          >
            {step === 4 ? t.onboarding.startLearning : t.onboarding.continue}
          </Button>
        ) : (
          <div className={styles.footer}>
            <Button type="button" variant="secondary" className={styles.backButton} onClick={handleBack}>
              {t.onboarding.back}
            </Button>
            <Button
              type="button"
              variant="primary"
              className={styles.footerContinue}
              onClick={handleContinue}
            >
              {t.onboarding.continue}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function RadioMark({ selected }: { selected: boolean }) {
  return (
    <span
      className={[styles.radio, selected ? styles.radioSelected : ''].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className={styles.radioDot} />
    </span>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className={styles.summaryCard}>
      <span className={styles.optionIcon}>
        <img src={icon} alt="" width={28} height={28} />
      </span>
      <div className={styles.optionText}>
        <span className={styles.optionTitle}>{label}</span>
        <span className={styles.optionDescription}>{value}</span>
      </div>
    </div>
  );
}
