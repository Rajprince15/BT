'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import { setAccessToken } from '@/lib/api';
import type { AuthPayload, AuthRegisterPayload, AuthChangePasswordPayload } from '@/services/auth.service';

export function useAuthMe() {
  return useQuery(['auth', 'me'], authService.me, {
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation(authService.login, {
    onSuccess(data) {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries(['auth', 'me']);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation(authService.register, {
    onSuccess(data) {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries(['auth', 'me']);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation(authService.logout, {
    onSuccess() {
      setAccessToken(null);
      queryClient.invalidateQueries(['auth', 'me']);
    },
  });
}

export function useChangePassword() {
  return useMutation(authService.changePassword);
}
