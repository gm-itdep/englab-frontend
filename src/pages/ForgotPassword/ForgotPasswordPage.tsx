import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Notice, TextField } from '../../components/ui';
import { mockSendPasswordResetLink } from '../../shared/auth/mockForgotPassword';
import { t } from '../../shared/i18n';
import {
  hasFieldErrors,
  validateForgotPasswordForm,
  type ForgotPasswordFieldErrors,
} from '../../shared/validation/forgotPasswordValidation';
import logoEnglab from '../../assets/images/logo-englab.svg';
import styles from './ForgotPasswordPage.module.css';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFieldErrors>({});
  const [isSent, setIsSent] = useState(false);

  const validationMessages = {
    emailRequired: t.forgotPassword.errorEmailRequired,
    emailInvalid: t.forgotPassword.errorEmailInvalid,
  };

  useEffect(() => {
    if (!isSent) return;

    const timer = window.setTimeout(() => {
      navigate('/reset-password', { replace: true, state: { email: email.trim() } });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [isSent, email, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = { email };
    const clientErrors = validateForgotPasswordForm(values, validationMessages);

    if (hasFieldErrors(clientErrors)) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      await mockSendPasswordResetLink(email.trim());
      setIsSent(true);
    } catch {
      setFieldErrors({ email: t.forgotPassword.errorEmailInvalid });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <form
        className={styles.card}
        aria-labelledby="forgot-password-title"
        onSubmit={handleSubmit}
        noValidate
      >
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
              <h1 id="forgot-password-title" className={styles.title}>
                {t.forgotPassword.title}
              </h1>
              <p className={styles.subtitle}>{t.forgotPassword.subtitle}</p>
            </div>

            {isSent ? <Notice>{t.forgotPassword.successBadge}</Notice> : null}

            <TextField
              id="forgot-password-email"
              label={t.forgotPassword.emailLabel}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t.forgotPassword.emailPlaceholder}
              value={email}
              errorMessage={fieldErrors.email}
              readOnly={isSent}
              onChange={(e) => {
                if (isSent) return;
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }
              }}
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.actions}>
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              {isLoading ? t.forgotPassword.loading : t.forgotPassword.submit}
            </Button>

            <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/login')}>
              {t.forgotPassword.backToLogin}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
