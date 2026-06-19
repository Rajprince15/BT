export type UserRole = 'customer' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
