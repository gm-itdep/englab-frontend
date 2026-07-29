import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Link, Separator, TextField } from '../../components/ui';
import { mockLogin, saveSession } from '../../shared/auth/mockAuth';
import { t } from '../../shared/i18n';
import logoEnglab from '../../assets/images/logo-englab.svg';
import iconEye from '../../assets/icons/eye.svg';
import iconGoogle from '../../assets/icons/google.svg';
import iconLock from '../../assets/icons/lock.svg';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAuthError, setHasAuthError] = useState(false);

  const clearError = () => {
    if (hasAuthError) setHasAuthError(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setHasAuthError(false);

    try {
      const result = await mockLogin(email, password);

      if (!result.ok) {
        setHasAuthError(true);
        return;
      }

      saveSession(result.user);
      navigate('/home', { replace: true });
    } catch {
      setHasAuthError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} aria-labelledby="login-title" onSubmit={handleSubmit} noValidate>
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
              <h1 id="login-title" className={styles.title}>
                {t.login.title}
              </h1>
              <p className={styles.subtitle}>{t.login.subtitle}</p>
            </div>

            <div className={styles.fieldsBlock}>
              <div className={styles.fields}>
                <TextField
                  id="login-email"
                  label={t.login.emailLabel}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t.login.emailPlaceholder}
                  value={email}
                  hasError={hasAuthError}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  required
                />

                <TextField
                  id="login-password"
                  label={t.login.passwordLabel}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder={t.login.passwordPlaceholder}
                  value={password}
                  hasError={hasAuthError}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  required
                  endAdornment={
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
                      aria-pressed={showPassword}
                    >
                      <span className={styles.eyeIcon}>
                        <img src={iconEye} alt="" width={12} height={12} />
                      </span>
                    </button>
                  }
                />
              </div>

              <Link to="/forgot-password" className={styles.forgot}>
                {t.login.forgotPassword}
              </Link>

              {hasAuthError ? <Alert>{t.login.errorInvalidCredentials}</Alert> : null}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.actions}>
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              {isLoading ? t.login.loading : t.login.submit}
            </Button>

            <Separator label={t.common.or} />

            <Button
              type="button"
              variant="secondary"
              fullWidth
              startIcon={<img src={iconGoogle} alt="" width={28} height={28} />}
            >
              {t.login.continueWithGoogle}
            </Button>
          </div>

          <p className={styles.signup}>
            <span className={styles.signupMuted}>{t.login.noAccount}</span>
            <Link to="/register">{t.login.createAccount}</Link>
          </p>
        </div>

        <div className={styles.secure}>
          <span className={styles.lockIcon}>
            <img src={iconLock} alt="" width={14} height={14} />
          </span>
          <span>{t.common.secureConnection}</span>
        </div>
      </form>
    </main>
  );
}
