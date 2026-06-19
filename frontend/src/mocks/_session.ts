import { User } from '@/types/User';
import { users } from '@/mocks/users.mock';

export interface MockSession {
  userId: number | null;
  accessToken: string | null;
}

export const session: MockSession = {
  userId: users[0]?.id ?? null,
  accessToken: 'mock-session-token',
};

export function setSession(userId: number | null, accessToken: string | null) {
  session.userId = userId;
  session.accessToken = accessToken;
}

export function getCurrentUser(): User | undefined {
  return users.find((user) => user.id === session.userId);
}
