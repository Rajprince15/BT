export type UserRole = 'customer' | 'admin' | 'super_admin';

export function canAccessAdmin(role: UserRole | null): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function isSuperAdmin(role: UserRole | null): boolean {
  return role === 'super_admin';
}
