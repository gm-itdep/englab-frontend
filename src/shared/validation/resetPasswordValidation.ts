import { getConfirmPasswordError } from './registerValidation';

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFieldErrors = Partial<Record<keyof ResetPasswordFormValues, string>>;

export function validateResetPasswordForm(
  values: ResetPasswordFormValues,
  messages: {
    passwordRequired: string;
    passwordMinLength: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
  },
): ResetPasswordFieldErrors {
  const errors: ResetPasswordFieldErrors = {};
  const { password, confirmPassword } = values;

  if (!password.length) {
    errors.password = messages.passwordRequired;
  } else if (password.length < 8) {
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

export function hasFieldErrors(errors: ResetPasswordFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
