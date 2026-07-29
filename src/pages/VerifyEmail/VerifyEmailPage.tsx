import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { t } from '../../shared/i18n';
import logoEnglab from '../../assets/images/logo-englab.svg';
import styles from './VerifyEmailPage.module.css';

const MOCK_CONFIRM_DELAY_MS = 5000;

export function VerifyEmailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/verify-email/success', { replace: true });
    }, MOCK_CONFIRM_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="verify-email-title" aria-busy="true">
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
            <h1 id="verify-email-title" className={styles.title}>
              {t.verifyEmail.title}
            </h1>
            <p className={styles.subtitle}>{t.verifyEmail.subtitle}</p>
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
              {t.verifyEmail.goToLogin}
            </Button>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerHint}>{t.verifyEmail.footerHint}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
