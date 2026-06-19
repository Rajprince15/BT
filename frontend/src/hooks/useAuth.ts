'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import { setAccessToken } from '@/lib/api';
import type {
  AuthPayload,
  AuthRegisterPayload,
  AuthChangePasswordPayload,
  AuthResponse,
} from '@/services/auth.service';

export function useAuthMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AuthPayload) => authService.login(payload),
    onSuccess(data: AuthResponse) {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AuthRegisterPayload) => authService.register(payload),
    onSuccess(data: AuthResponse) {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess() {
      setAccessToken(null);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: AuthChangePasswordPayload) => authService.changePassword(payload),
  });
}
