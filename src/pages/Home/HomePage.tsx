import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../../shared/auth/mockAuth';
import { OnboardingGoalModal, type LearningGoalId } from './OnboardingGoalModal';
import styles from './HomePage.module.css';

export function HomePage() {
  const session = getSession();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(true);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
  };

  const handleContinueOnboarding = (_goalId: LearningGoalId) => {
    setIsOnboardingOpen(false);
  };

  return (
    <main className={styles.page}>
      {isOnboardingOpen ? (
        <OnboardingGoalModal onClose={handleCloseOnboarding} onContinue={handleContinueOnboarding} />
      ) : null}
    </main>
  );
}
