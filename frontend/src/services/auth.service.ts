import type { AxiosResponse } from 'axios';
import api, { setAccessToken } from '@/lib/api';
import env from '@/lib/env';
import { users } from '@/mocks/users.mock';
import { session, setSession, getCurrentUser } from '@/mocks/_session';
import { mockDelay, useMockService } from '@/services/_mock-runtime';
import type { User } from '@/types/User';
import type { ApiResponse } from '@/types/api';

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthRegisterPayload extends AuthPayload {
  name: string;
  phone?: string;
}

export interface AuthChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' = 'post') {
  const response = await api.request<ApiResponse<T>>({
    url: path,
    method,
    data: payload,
  });

  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }

  return response.data.data;
}

export const authService = {
  async login(payload: AuthPayload) {
    if (useMockService) {
      await mockDelay();
      const user = users.find((candidate) => candidate.email === payload.email);
      if (!user) {
        throw new Error('Invalid email or password.');
      }
      const token = `mock-token-${user.id}`;
      setSession(user.id, token);
      setAccessToken(token);
      return { accessToken: token, user };
    }

    const data = await callApi<AuthResponse>('/auth/login', payload, 'post');
    setAccessToken(data.accessToken);
    return data;
  },

  async register(payload: AuthRegisterPayload) {
    if (useMockService) {
      await mockDelay();
      const exists = users.some((user) => user.email === payload.email);
      if (exists) {
        throw new Error('Email already registered.');
      }

      const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
      const user: User = {
        id: nextId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: 'customer',
        emailVerified: false,
        status: 'active',
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(user);
      const token = `mock-token-${user.id}`;
      setSession(user.id, token);
      setAccessToken(token);
      return { accessToken: token, user };
    }

    const data = await callApi<AuthResponse>('/auth/register', payload, 'post');
    setAccessToken(data.accessToken);
    return data;
  },

  async refresh() {
    if (useMockService) {
      await mockDelay();
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Session expired.');
      }
      const token = `mock-token-${user.id}`;
      setSession(user.id, token);
      setAccessToken(token);
      return { accessToken: token, user };
    }

    return callApi<AuthResponse>('/auth/refresh', undefined, 'post');
  },

  async logout() {
    if (useMockService) {
      await mockDelay();
      setSession(null, null);
      setAccessToken(null);
      return { success: true };
    }

    const data = await callApi<{ success: boolean }>('/auth/logout', undefined, 'post');
    setAccessToken(null);
    return data;
  },

  async me() {
    if (useMockService) {
      await mockDelay();
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Not authenticated.');
      }
      return user;
    }

    return callApi<User>('/auth/me', undefined, 'get');
  },

  async changePassword(payload: AuthChangePasswordPayload) {
    if (useMockService) {
      await mockDelay();
      if (!getCurrentUser()) {
        throw new Error('Not authenticated.');
      }
      return { success: true };
    }

    return callApi<{ success: boolean }>('/auth/change-password', payload, 'post');
  },
};

export default authService;
