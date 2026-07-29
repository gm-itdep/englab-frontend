import { useState } from 'react';
import { Button } from '../../components/ui';
import { t } from '../../shared/i18n';
import iconClose from '../../assets/icons/modal-close.svg';
import iconBusiness from '../../assets/icons/onboarding/business-communication.svg';
import iconExam from '../../assets/icons/onboarding/exam-prep.svg';
import iconInterview from '../../assets/icons/onboarding/interview.svg';
import iconSpeaking from '../../assets/icons/onboarding/speaking-practice.svg';
import iconTravel from '../../assets/icons/onboarding/travel.svg';
import styles from './OnboardingGoalModal.module.css';

export type LearningGoalId = 'speaking' | 'business' | 'travel' | 'interview' | 'exam';

type GoalOption = {
  id: LearningGoalId;
  title: string;
  description: string;
  icon: string;
};

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'speaking',
    title: t.onboarding.goals.speaking.title,
    description: t.onboarding.goals.speaking.description,
    icon: iconSpeaking,
  },
  {
    id: 'business',
    title: t.onboarding.goals.business.title,
    description: t.onboarding.goals.business.description,
    icon: iconBusiness,
  },
  {
    id: 'travel',
    title: t.onboarding.goals.travel.title,
    description: t.onboarding.goals.travel.description,
    icon: iconTravel,
  },
  {
    id: 'interview',
    title: t.onboarding.goals.interview.title,
    description: t.onboarding.goals.interview.description,
    icon: iconInterview,
  },
  {
    id: 'exam',
    title: t.onboarding.goals.exam.title,
    description: t.onboarding.goals.exam.description,
    icon: iconExam,
  },
];

type OnboardingGoalModalProps = {
  onClose: () => void;
  onContinue: (goalId: LearningGoalId) => void;
};

export function OnboardingGoalModal({ onClose, onContinue }: OnboardingGoalModalProps) {
  const [selectedGoal, setSelectedGoal] = useState<LearningGoalId>('speaking');

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-goal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 id="onboarding-goal-title" className={styles.title}>
              {t.onboarding.title}
            </h2>
            <p className={styles.step}>{t.onboarding.step}</p>
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
          <div className={styles.questionBlock}>
            <p className={styles.question}>{t.onboarding.question}</p>
            <p className={styles.questionHint}>{t.onboarding.questionHint}</p>
          </div>

          <div className={styles.options} role="radiogroup" aria-label={t.onboarding.question}>
            {GOAL_OPTIONS.map((option) => {
              const isSelected = selectedGoal === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={[styles.option, isSelected ? styles.optionSelected : ''].filter(Boolean).join(' ')}
                  onClick={() => setSelectedGoal(option.id)}
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

                  <span
                    className={[styles.radio, isSelected ? styles.radioSelected : ''].filter(Boolean).join(' ')}
                    aria-hidden="true"
                  >
                    <span className={styles.radioDot} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          className={styles.continueButton}
          onClick={() => onContinue(selectedGoal)}
        >
          {t.onboarding.continue}
        </Button>
      </div>
    </div>
  );
}
