import api from '@/lib/api';
import { users } from '@/mocks/users.mock';
import { addresses } from '@/mocks/addresses.mock';
import { session } from '@/mocks/_session';
import type { User } from '@/types/User';
import type { Address } from '@/types/Address';
import type { ApiResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' | 'delete' = 'get') {
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

const getUser = () => {
  if (!session.userId) {
    throw new Error('Not authenticated');
  }
  const user = users.find((item) => item.id === session.userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const userService = {
  async profile() {
    if (useMockService) {
      await mockDelay();
      return getUser();
    }
    return callApi<User>('/users/me', undefined, 'get');
  },

  async updateProfile(payload: Partial<Pick<User, 'name' | 'phone'>>) {
    if (useMockService) {
      await mockDelay();
      const user = getUser();
      Object.assign(user, payload);
      user.updatedAt = new Date().toISOString();
      return user;
    }
    return callApi<User>('/users/me', payload, 'patch');
  },

  addresses: {
    async list() {
      if (useMockService) {
        await mockDelay();
        return addresses.filter((address) => address.userId === session.userId);
      }
      return callApi<Address[]>('/users/addresses', undefined, 'get');
    },

    async add(payload: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
      if (useMockService) {
        await mockDelay();
        const nextId = Math.max(0, ...addresses.map((address) => address.id)) + 1;
        const newAddress: Address = {
          id: nextId,
          userId: session.userId!,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addresses.push(newAddress);
        return newAddress;
      }
      return callApi<Address>('/users/addresses', payload, 'post');
    },

    async update(id: number, payload: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
      if (useMockService) {
        await mockDelay();
        const address = addresses.find((entry) => entry.id === id && entry.userId === session.userId);
        if (!address) {
          throw new Error('Address not found');
        }
        Object.assign(address, payload);
        address.updatedAt = new Date().toISOString();
        return address;
      }
      return callApi<Address>(`/users/addresses/${id}`, payload, 'patch');
    },

    async remove(id: number) {
      if (useMockService) {
        await mockDelay();
        const index = addresses.findIndex((entry) => entry.id === id && entry.userId === session.userId);
        if (index >= 0) {
          addresses.splice(index, 1);
        }
        return { success: true };
      }
      return callApi<{ success: boolean }>(`/users/addresses/${id}`, undefined, 'delete');
    },
  },
};

export default userService;
