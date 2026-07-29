export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterFieldErrors = Partial<Record<keyof RegisterFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getConfirmPasswordError(
  password: string,
  confirmPassword: string,
  messages: {
    confirmPasswordRequired: string;
    passwordMismatch: string;
  },
): string | undefined {
  if (!confirmPassword.length) {
    return messages.confirmPasswordRequired;
  }

  if (password !== confirmPassword) {
    return messages.passwordMismatch;
  }

  return undefined;
}

export function validateRegisterForm(
  values: RegisterFormValues,
  messages: {
    firstNameRequired: string;
    lastNameRequired: string;
    emailInvalid: string;
    passwordMinLength: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
    emailTaken: string;
  },
  options?: { emailTaken?: boolean },
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const email = values.email.trim();
  const password = values.password;
  const confirmPassword = values.confirmPassword;

  if (!firstName) {
    errors.firstName = messages.firstNameRequired;
  }

  if (!lastName) {
    errors.lastName = messages.lastNameRequired;
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = messages.emailInvalid;
  } else if (options?.emailTaken) {
    errors.email = messages.emailTaken;
  }

  if (password.length > 0 && password.length < 8) {
    errors.password = messages.passwordMinLength;
  }

  const confirmError = getConfirmPasswordError(password, confirmPassword, {
    confirmPasswordRequired: messages.confirmPasswordRequired,
    passwordMismatch: messages.passwordMismatch,
  });

  if (confirmError) {
    errors.confirmPassword = confirmError;
  }

  return errors;
}

export function hasFieldErrors(errors: RegisterFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
