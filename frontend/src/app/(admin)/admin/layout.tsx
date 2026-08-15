'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuthMe } from '@/hooks/useAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useAuthMe();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/auth/login?next=/admin/dashboard');
      return;
    }
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main data-testid="admin-layout-loading" className="min-h-screen bg-bg">
        <div className="p-10 text-xs uppercase tracking-wider2 text-ink-2">Checking access…</div>
      </main>
    );
  }
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    return (
      <main data-testid="admin-layout-forbidden" className="min-h-screen bg-bg p-10">
        <p className="text-danger">403 · This area is restricted to administrators.</p>
      </main>
    );
  }

  return (
    <main data-testid="admin-layout" className="min-h-screen bg-bg">
      <div className="grid min-h-screen grid-cols-[240px_1fr]">
        <AdminSidebar role={user.role} />
        <section className="min-w-0 overflow-x-auto bg-bg p-8">{children}</section>
      </div>
    </main>
  );
}
