import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { getSession } from '../../shared/auth/mockAuth';
import styles from '../Home/HomePage.module.css';
import { StudentBookingPage } from './StudentBookingPage';
import { StudentBookingSlotPage } from './StudentBookingSlotPage';

export function BookingPage() {
  const session = getSession();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const previewRole = searchParams.get('role');
  const isPreviewState =
    searchParams.get('loading') === '1' ||
    searchParams.get('empty') === '1' ||
    searchParams.get('confirm') === '1' ||
    searchParams.get('insufficient') === '1' ||
    searchParams.get('success') === '1' ||
    previewRole === 'student' ||
    previewRole === 'teacher' ||
    previewRole === 'admin';
  const role =
    session?.role ??
    (isPreviewState
      ? previewRole === 'student' ||
        (!previewRole &&
          (searchParams.get('confirm') === '1' ||
            searchParams.get('insufficient') === '1' ||
            searchParams.get('success') === '1'))
        ? 'student'
        : previewRole === 'teacher'
          ? 'teacher'
          : 'admin'
      : null);

  if (!session && !isPreviewState) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'student') {
    return <Navigate to="/home" replace />;
  }

  const isSlotStep = location.pathname.endsWith('/slot');

  return (
    <main className={styles.page}>
      {isSlotStep ? <StudentBookingSlotPage /> : <StudentBookingPage />}
    </main>
  );
}
