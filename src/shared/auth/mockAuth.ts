export const MOCK_USER = {
  email: 'ivanpetrov@example.ru',
  password: 'EngLab123!',
  name: 'Иван Петров',
} as const;

const MOCK_DELAY_MS = 1500;

export type AuthUser = {
  email: string;
  name: string;
};

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: 'invalid_credentials' | 'empty_fields' | 'password_mismatch' | 'email_taken' };

function delay(ms = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(email: string, password: string): Promise<AuthResult> {
  await delay();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!normalizedEmail || !normalizedPassword) {
    return { ok: false, reason: 'empty_fields' };
  }

  const isValid =
    normalizedEmail === MOCK_USER.email.toLowerCase() &&
    normalizedPassword === MOCK_USER.password;

  if (!isValid) {
    return { ok: false, reason: 'invalid_credentials' };
  }

  return {
    ok: true,
    user: { email: MOCK_USER.email, name: MOCK_USER.name },
  };
}

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export async function mockRegister(payload: RegisterPayload): Promise<AuthResult> {
  await delay();

  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();
  const email = payload.email.trim().toLowerCase();
  const password = payload.password.trim();
  const confirmPassword = payload.confirmPassword.trim();

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return { ok: false, reason: 'empty_fields' };
  }

  if (password !== confirmPassword) {
    return { ok: false, reason: 'password_mismatch' };
  }

  if (email === MOCK_USER.email.toLowerCase()) {
    return { ok: false, reason: 'email_taken' };
  }

  return {
    ok: true,
    user: {
      email,
      name: `${firstName} ${lastName}`,
    },
  };
}

const AUTH_STORAGE_KEY = 'englab.auth';

export function saveSession(user: AuthUser): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getSession(): AuthUser | null {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
