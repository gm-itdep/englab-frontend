import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { t } from '../../shared/i18n';
import logoEnglab from '../../assets/images/logo-englab.svg';
import styles from './VerifyEmailSuccessPage.module.css';

export function VerifyEmailSuccessPage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="verify-email-success-title">
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
            <h1 id="verify-email-success-title" className={styles.title}>
              {t.verifyEmail.successTitle}
            </h1>
            <p className={styles.subtitle}>{t.verifyEmail.successSubtitle}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.actions}>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => navigate('/home', { replace: true })}
            >
              {t.verifyEmail.goToCabinet}
            </Button>
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerHint}>{t.verifyEmail.successFooterHint}</p>
        </div>
      </section>
    </main>
  );
}
