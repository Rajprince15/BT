'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService from '@/services/user.service';
import type { Address } from '@/types/Address';

export function useAddresses() {
  return useQuery(['addresses'], userService.addresses.list, {
    staleTime: 20_000,
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation((payload: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => userService.addresses.add(payload), {
    onSuccess() {
      queryClient.invalidateQueries(['addresses']);
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation(({ id, payload }: { id: number; payload: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> }) => userService.addresses.update(id, payload), {
    onSuccess() {
      queryClient.invalidateQueries(['addresses']);
    },
  });
}

export function useRemoveAddress() {
  const queryClient = useQueryClient();
  return useMutation((id: number) => userService.addresses.remove(id), {
    onSuccess() {
      queryClient.invalidateQueries(['addresses']);
    },
  });
}
