const MOCK_DELAY_MS = 1500;

export async function mockSendPasswordResetLink(_email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}
