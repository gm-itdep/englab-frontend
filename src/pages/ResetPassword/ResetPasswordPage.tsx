import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField } from '../../components/ui';
import { mockResetPassword } from '../../shared/auth/mockResetPassword';
import { t } from '../../shared/i18n';
import { getConfirmPasswordError } from '../../shared/validation/registerValidation';
import {
  hasFieldErrors,
  validateResetPasswordForm,
  type ResetPasswordFieldErrors,
} from '../../shared/validation/resetPasswordValidation';
import logoEnglab from '../../assets/images/logo-englab.svg';
import iconArrow from '../../assets/icons/arrow.svg';
import iconEye from '../../assets/icons/eye.svg';
import styles from './ResetPasswordPage.module.css';

type ResetPasswordLocationState = {
  email?: string;
};

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResetPasswordLocationState | null;
  const email = state?.email?.trim() ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordFieldErrors>({});

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const validationMessages = {
    passwordRequired: t.resetPassword.errorPasswordRequired,
    passwordMinLength: t.resetPassword.errorPasswordMinLength,
    confirmPasswordRequired: t.resetPassword.errorConfirmPasswordRequired,
    passwordMismatch: t.resetPassword.errorPasswordMismatch,
  };

  const syncConfirmError = (nextPassword: string, nextConfirm = confirmPassword) => {
    const confirmError = getConfirmPasswordError(nextPassword, nextConfirm, {
      confirmPasswordRequired: validationMessages.confirmPasswordRequired,
      passwordMismatch: validationMessages.passwordMismatch,
    });

    setFieldErrors((prev) => {
      if (!confirmError) {
        if (!prev.confirmPassword) return prev;
        const next = { ...prev };
        delete next.confirmPassword;
        return next;
      }

      return { ...prev, confirmPassword: confirmError };
    });
  };

  const clearFieldError = (field: keyof ResetPasswordFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = { password, confirmPassword };
    const clientErrors = validateResetPasswordForm(values, validationMessages);

    if (hasFieldErrors(clientErrors)) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      await mockResetPassword(email, password);
      navigate('/reset-password/success', { replace: true });
    } catch {
      setFieldErrors(validateResetPasswordForm(values, validationMessages));
    } finally {
      setIsLoading(false);
    }
  };

  const renderEyeButton = () => (
    <button
      type="button"
      className={styles.eyeButton}
      onClick={() => setShowPassword((prev) => !prev)}
      aria-label={showPassword ? t.resetPassword.hidePassword : t.resetPassword.showPassword}
      aria-pressed={showPassword}
    >
      <span className={styles.adornmentIcon}>
        <img src={iconEye} alt="" width={16} height={16} />
      </span>
    </button>
  );

  return (
    <main className={styles.page}>
      <form
        className={styles.card}
        aria-labelledby="reset-password-title"
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
              <h1 id="reset-password-title" className={styles.title}>
                {t.resetPassword.title}
              </h1>
              <p className={styles.subtitle}>{t.resetPassword.subtitle}</p>
            </div>

            <div className={styles.fields}>
              <TextField
                id="reset-password"
                label={t.resetPassword.passwordLabel}
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder={t.resetPassword.passwordPlaceholder}
                value={password}
                errorMessage={fieldErrors.password}
                onChange={(e) => {
                  const nextPassword = e.target.value;
                  setPassword(nextPassword);
                  clearFieldError('password');
                  syncConfirmError(nextPassword);
                }}
                endAdornment={renderEyeButton()}
              />

              <TextField
                id="reset-confirm-password"
                label={t.resetPassword.confirmPasswordLabel}
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder={t.resetPassword.confirmPasswordPlaceholder}
                value={confirmPassword}
                errorMessage={fieldErrors.confirmPassword}
                onChange={(e) => {
                  const nextConfirm = e.target.value;
                  setConfirmPassword(nextConfirm);
                  clearFieldError('confirmPassword');
                  syncConfirmError(password, nextConfirm);
                }}
                onBlur={() => {
                  syncConfirmError(password);
                }}
                endAdornment={renderEyeButton()}
              />
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.actions}>
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              {isLoading ? t.resetPassword.loading : t.resetPassword.submit}
            </Button>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              startIcon={
                <span className={styles.backIcon}>
                  <img src={iconArrow} alt="" width={17} height={17} />
                </span>
              }
              onClick={() => navigate('/login')}
            >
              {t.resetPassword.backToLogin}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
