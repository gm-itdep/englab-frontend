import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { t } from '../../shared/i18n';
import logoEnglab from '../../assets/images/logo-englab.svg';
import styles from './ResetPasswordSuccessPage.module.css';

export function ResetPasswordSuccessPage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="reset-password-success-title">
        <div className={styles.top}>
          <div className={styles.logoWrap}>
            <img
              src={logoEnglab}
              alt={t.common.brand}
              className={styles.logo}
              width={215}
              height={54}
            />
          </div>

          <div className={styles.headings}>
            <h1 id="reset-password-success-title" className={styles.title}>
              {t.resetPassword.successTitle}
            </h1>
            <p className={styles.subtitle}>{t.resetPassword.successSubtitle}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => navigate('/login', { replace: true })}
            >
              {t.resetPassword.goToLogin}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
