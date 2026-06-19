import type { User } from '@/types/User';

const now = '2026-01-05T10:00:00.000Z';

export const users: User[] = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'customer@bhavita.test',
    phone: '+91-9810000001',
    role: 'customer',
    emailVerified: true,
    status: 'active',
    lastLoginAt: now,
    createdAt: '2025-11-01T10:00:00.000Z',
    updatedAt: now,
  },
  {
    id: 2,
    name: 'Meera Iyer',
    email: 'admin@bhavita.test',
    phone: '+91-9810000002',
    role: 'admin',
    emailVerified: true,
    status: 'active',
    lastLoginAt: now,
    createdAt: '2025-10-01T10:00:00.000Z',
    updatedAt: now,
  },
  {
    id: 3,
    name: 'Vikram Rao',
    email: 'super@bhavita.test',
    phone: '+91-9810000003',
    role: 'super_admin',
    emailVerified: true,
    status: 'active',
    lastLoginAt: now,
    createdAt: '2025-09-01T10:00:00.000Z',
    updatedAt: now,
  },
];

// Mock password store (frontend phase only). Real auth uses bcrypt server-side.
export const mockPasswords: Record<string, string> = {
  'customer@bhavita.test': 'Customer@123',
  'admin@bhavita.test': 'Admin@1234',
  'super@bhavita.test': 'Super@1234',
};
