import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Link, Separator, TextField } from '../../components/ui';
import { mockRegister } from '../../shared/auth/mockAuth';
import { t } from '../../shared/i18n';
import {
  getConfirmPasswordError,
  hasFieldErrors,
  validateRegisterForm,
  type RegisterFieldErrors,
} from '../../shared/validation/registerValidation';
import logoEnglab from '../../assets/images/logo-englab.svg';
import iconClose from '../../assets/icons/close.svg';
import iconEye from '../../assets/icons/eye.svg';
import iconGoogle from '../../assets/icons/google.svg';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

  const validationMessages = {
    firstNameRequired: t.register.errorFirstNameRequired,
    lastNameRequired: t.register.errorLastNameRequired,
    emailInvalid: t.register.errorEmailInvalid,
    passwordMinLength: t.register.errorPasswordMinLength,
    confirmPasswordRequired: t.register.errorConfirmPasswordRequired,
    passwordMismatch: t.register.errorPasswordMismatch,
    emailTaken: t.register.errorEmailTaken,
  };

  const syncConfirmError = (nextPassword: string, nextConfirm = confirmPassword) => {
    const confirmError = getConfirmPasswordError(nextPassword, nextConfirm, {
      confirmPasswordRequired: t.register.errorConfirmPasswordRequired,
      passwordMismatch: t.register.errorPasswordMismatch,
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

  const clearFieldError = (field: keyof RegisterFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = { firstName, lastName, email, password, confirmPassword };
    const clientErrors = validateRegisterForm(values, validationMessages);

    if (hasFieldErrors(clientErrors)) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const result = await mockRegister(values);

      if (!result.ok) {
        if (result.reason === 'email_taken') {
          setFieldErrors(
            validateRegisterForm(values, validationMessages, { emailTaken: true }),
          );
        } else if (result.reason === 'password_mismatch') {
          setFieldErrors({
            confirmPassword: t.register.errorPasswordMismatch,
          });
        } else {
          setFieldErrors(validateRegisterForm(values, validationMessages));
        }
        return;
      }

      navigate('/register/success', { replace: true, state: { email: result.user.email } });
    } catch {
      setFieldErrors(validateRegisterForm(values, validationMessages));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <form
        className={styles.card}
        aria-labelledby="register-title"
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

          <div className={styles.headings}>
            <h1 id="register-title" className={styles.title}>
              {t.register.title}
            </h1>
            <p className={styles.subtitle}>{t.register.subtitle}</p>
          </div>

          <div className={styles.fields}>
            <TextField
              id="register-first-name"
              label={t.register.firstNameLabel}
              name="firstName"
              autoComplete="given-name"
              placeholder={t.register.firstNamePlaceholder}
              value={firstName}
              errorMessage={fieldErrors.firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                clearFieldError('firstName');
              }}
            />

            <TextField
              id="register-last-name"
              label={t.register.lastNameLabel}
              name="lastName"
              autoComplete="family-name"
              placeholder={t.register.lastNamePlaceholder}
              value={lastName}
              errorMessage={fieldErrors.lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                clearFieldError('lastName');
              }}
            />

            <TextField
              id="register-email"
              label={t.register.emailLabel}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t.register.emailPlaceholder}
              value={email}
              errorMessage={fieldErrors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError('email');
              }}
            />

            <TextField
              id="register-password"
              label={t.register.passwordLabel}
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              placeholder={t.register.passwordPlaceholder}
              value={password}
              errorMessage={fieldErrors.password}
              onChange={(e) => {
                const nextPassword = e.target.value;
                setPassword(nextPassword);
                clearFieldError('password');
                syncConfirmError(nextPassword);
              }}
              endAdornment={
                password ? (
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => {
                      setPassword('');
                      clearFieldError('password');
                      syncConfirmError('');
                    }}
                    aria-label={t.register.clearPassword}
                  >
                    <span className={styles.adornmentIcon}>
                      <img src={iconClose} alt="" width={16} height={16} />
                    </span>
                  </button>
                ) : undefined
              }
            />

            <TextField
              id="register-confirm-password"
              label={t.register.confirmPasswordLabel}
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder={t.register.confirmPasswordPlaceholder}
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
              endAdornment={
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? t.register.hidePassword : t.register.showPassword}
                  aria-pressed={showPassword}
                >
                  <span className={styles.adornmentIcon}>
                    <img src={iconEye} alt="" width={16} height={16} />
                  </span>
                </button>
              }
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.actions}>
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              {isLoading ? t.register.loading : t.register.submit}
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

          <p className={styles.footer}>
            <span className={styles.footerMuted}>{t.register.hasAccount}</span>
            <Link to="/login">{t.register.signIn}</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
