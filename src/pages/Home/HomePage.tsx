import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { clearSession, getSession } from '../../shared/auth/mockAuth';
import { t } from '../../shared/i18n';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>
          {t.home.welcome}, {session.name}
        </h1>
        <p className={styles.email}>{session.email}</p>
        <Button type="button" variant="primary" onClick={handleLogout}>
          {t.home.logout}
        </Button>
      </section>
    </main>
  );
}
