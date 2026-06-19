import env from '@/lib/env';

export const useMockService = env.NEXT_PUBLIC_USE_MOCKS;

export function mockDelay(ms = 120) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
