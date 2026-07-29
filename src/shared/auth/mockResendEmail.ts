const MOCK_DELAY_MS = 1200;

export async function mockResendConfirmationEmail(_email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}
