import { Navigate, useSearchParams } from 'react-router-dom';
import { getSession } from '../../shared/auth/mockAuth';
import styles from '../Home/HomePage.module.css';
import { StudentTopupPage } from './StudentTopupPage';

export function TopupPage() {
  const session = getSession();
  const [searchParams] = useSearchParams();

  const previewRole = searchParams.get('role');
  const isPreviewState =
    searchParams.get('loading') === '1' ||
    searchParams.get('empty') === '1' ||
    searchParams.get('selected') != null ||
    searchParams.get('paying') === '1' ||
    previewRole === 'student' ||
    previewRole === 'teacher' ||
    previewRole === 'admin';
  const role =
    session?.role ??
    (isPreviewState
      ? previewRole === 'teacher'
        ? 'teacher'
        : previewRole === 'admin'
          ? 'admin'
          : 'student'
      : null);

  if (!session && !isPreviewState) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'student') {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className={styles.page}>
      <StudentTopupPage />
    </main>
  );
}
