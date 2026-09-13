import { Navigate, useSearchParams } from 'react-router-dom';
import { getSession } from '../../shared/auth/mockAuth';
import styles from '../Home/HomePage.module.css';
import { NotificationsView } from './NotificationsView';

export function NotificationsPage() {
  const session = getSession();
  const [searchParams] = useSearchParams();

  const previewRole = searchParams.get('role');
  const isPreviewState =
    searchParams.get('loading') === '1' ||
    searchParams.get('empty') === '1' ||
    previewRole === 'student' ||
    previewRole === 'teacher' ||
    previewRole === 'admin';

  if (!session && !isPreviewState) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className={styles.page}>
      <NotificationsView />
    </main>
  );
}
