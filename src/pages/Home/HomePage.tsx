import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../../shared/auth/mockAuth';
import { OnboardingModal, type OnboardingAnswers } from './OnboardingModal';
import { TeacherDashboard } from './TeacherDashboard';
import styles from './HomePage.module.css';

export function HomePage() {
  const session = getSession();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
  };

  const handleCompleteOnboarding = (_answers: OnboardingAnswers) => {
    setIsOnboardingOpen(false);
  };

  return (
    <main className={styles.page}>
      <TeacherDashboard />
      {isOnboardingOpen ? (
        <OnboardingModal onClose={handleCloseOnboarding} onComplete={handleCompleteOnboarding} />
      ) : null}
    </main>
  );
}
