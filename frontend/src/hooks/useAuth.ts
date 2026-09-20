'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import type {
  AuthPayload,
  AuthRegisterPayload,
  AuthChangePasswordPayload,
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
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AuthRegisterPayload) => authService.register(payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: AuthChangePasswordPayload) => authService.changePassword(payload),
  });
}