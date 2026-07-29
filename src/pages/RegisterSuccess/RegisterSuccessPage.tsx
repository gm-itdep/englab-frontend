import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Link, Separator } from '../../components/ui';
import { mockResendConfirmationEmail } from '../../shared/auth/mockResendEmail';
import { t } from '../../shared/i18n';
import logoEnglab from '../../assets/images/logo-englab.svg';
import iconEmail from '../../assets/icons/email.svg';
import iconGoogle from '../../assets/icons/google.svg';
import styles from './RegisterSuccessPage.module.css';

type SuccessLocationState = {
  email?: string;
};

export function RegisterSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SuccessLocationState | null;
  const email = state?.email?.trim() ?? '';

  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    const timer = window.setTimeout(() => {
      navigate('/verify-email', { replace: true });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [email, navigate]);

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const handleResend = async () => {
    setResendNotice(null);
    setIsResending(true);

    try {
      await mockResendConfirmationEmail(email);
      setResendNotice(t.register.resendSuccess);
    } catch {
      setResendNotice(null);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="register-success-title">
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

          <div className={styles.content}>
            <div className={styles.headings}>
              <h1 id="register-success-title" className={styles.title}>
                {t.register.successTitle}
              </h1>
              <p className={styles.subtitle}>{t.register.successSubtitle}</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.actions}>
            {resendNotice ? (
              <p className={styles.notice} role="status">
                {resendNotice}
              </p>
            ) : null}

            <Button
              type="button"
              variant="primary"
              fullWidth
              isLoading={isResending}
              onClick={handleResend}
            >
              {isResending ? t.register.resendLoading : t.register.resendEmail}
            </Button>

            <Separator label={t.common.or} />

            <Button
              type="button"
              variant="secondary"
              fullWidth
              startIcon={<img src={iconGoogle} alt="" width={28} height={28} />}
            >
              {t.register.continueWithGoogle}
            </Button>
          </div>

          <div className={styles.help}>
            <span className={styles.emailIcon}>
              <img src={iconEmail} alt="" width={28} height={28} />
            </span>
            <div className={styles.helpText}>
              <p className={styles.helpTitle}>{t.register.noEmailTitle}</p>
              <p className={styles.helpHint}>{t.register.noEmailHint}</p>
            </div>
          </div>

          <p className={styles.footer}>
            <span className={styles.footerMuted}>{t.register.hasAccount}</span>
            <Link to="/login">{t.register.signIn}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
