import { Navigate, useSearchParams } from 'react-router-dom';
import { getSession } from '../../shared/auth/mockAuth';
import styles from '../Home/HomePage.module.css';
import { StudentProfilePage } from './StudentProfilePage';

export function ProfilePage() {
  const session = getSession();
  const [searchParams] = useSearchParams();

  const previewRole = searchParams.get('role');
  const isPreviewState =
    searchParams.get('loading') === '1' ||
    searchParams.get('empty') === '1' ||
    searchParams.get('edit') === '1' ||
    searchParams.get('menu') != null ||
    previewRole === 'student' ||
    previewRole === 'teacher' ||
    previewRole === 'admin';

  if (!session && !isPreviewState) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className={styles.page}>
      <StudentProfilePage />
    </main>
  );
}
