import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { getSession } from '../../shared/auth/mockAuth';
import { OnboardingModal, type OnboardingAnswers } from './OnboardingModal';
import { TeacherDashboard } from './TeacherDashboard';
import { AdminDashboard } from './AdminDashboard';
import styles from './HomePage.module.css';

export function HomePage() {
  const session = getSession();
  const [searchParams] = useSearchParams();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const isPreviewState =
    searchParams.get('loading') === '1' || searchParams.get('empty') === '1';
  const isAdmin = session?.role === 'admin' || (!session && isPreviewState);

  if (!session && !isPreviewState) {
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
      {isAdmin ? <AdminDashboard /> : <TeacherDashboard />}
      {!isAdmin && isOnboardingOpen ? (
        <OnboardingModal onClose={handleCloseOnboarding} onComplete={handleCompleteOnboarding} />
      ) : null}
    </main>
  );
}
