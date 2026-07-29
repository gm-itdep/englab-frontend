export type ForgotPasswordFormValues = {
  email: string;
};

export type ForgotPasswordFieldErrors = Partial<Record<keyof ForgotPasswordFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateForgotPasswordForm(
  values: ForgotPasswordFormValues,
  messages: {
    emailRequired: string;
    emailInvalid: string;
  },
): ForgotPasswordFieldErrors {
  const errors: ForgotPasswordFieldErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = messages.emailRequired;
    return errors;
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = messages.emailInvalid;
  }

  return errors;
}

export function hasFieldErrors(errors: ForgotPasswordFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
