import { Navigate, useSearchParams } from 'react-router-dom';
import { getSession } from '../../shared/auth/mockAuth';
import styles from '../Home/HomePage.module.css';
import { StudentLessonPage } from './StudentLessonPage';
import { TeacherLessonPage } from './TeacherLessonPage';

export function LessonPage() {
  const session = getSession();
  const [searchParams] = useSearchParams();

  const previewRole = searchParams.get('role');
  const isPreviewState =
    searchParams.get('loading') === '1' ||
    searchParams.get('empty') === '1' ||
    searchParams.get('ask') === '1' ||
    searchParams.get('hw') === '1' ||
    previewRole === 'student' ||
    previewRole === 'teacher' ||
    previewRole === 'admin';
  const role =
    session?.role ??
    (isPreviewState
      ? previewRole === 'student'
        ? 'student'
        : previewRole === 'teacher'
          ? 'teacher'
          : 'admin'
      : null);

  if (!session && !isPreviewState) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'student') {
    return (
      <main className={styles.page}>
        <StudentLessonPage />
      </main>
    );
  }

  return <TeacherLessonPage />;
}
