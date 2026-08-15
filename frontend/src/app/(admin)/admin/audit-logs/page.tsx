'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import adminAuditService from '@/services/admin/audit.service';
import { useAuthMe } from '@/hooks/useAuth';
import type { AuditLog } from '@/types/AuditLog';

export default function AdminAuditPage() {
  const router = useRouter();
  const { data: user } = useAuthMe();
  const [entity, setEntity] = useState('');

  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit', entity],
    queryFn: () => adminAuditService.list({ entity: entity || undefined, pageSize: 100 }),
    enabled: user?.role === 'super_admin',
  });

  if (user && user.role !== 'super_admin') {
    return <p data-testid="admin-audit-forbidden" className="text-danger">This area is restricted to super administrators.</p>;
  }

  return (
    <div data-testid="admin-audit-page" className="grid gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Trace &amp; oversight</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Audit log</h1>
      </header>

      <input
        data-testid="admin-audit-filter"
        placeholder="Filter by entity (product, banner, review…)"
        value={entity}
        onChange={(event) => setEntity(event.target.value)}
        className="h-11 max-w-md rounded border border-border bg-surface px-4 text-sm outline-none focus:border-gold"
      />

      <DataTable<AuditLog>
        testId="admin-audit-table"
        loading={isLoading}
        rows={data?.items ?? []}
        getRowId={(row) => row.id}
        columns={[
          { key: 'createdAt', header: 'When', render: (row) => new Date(row.createdAt).toLocaleString('en-IN') },
          { key: 'actor', header: 'Actor', render: (row) => `${row.actorRole ?? 'system'} #${row.actorId ?? '—'}` },
          { key: 'action', header: 'Action' },
          { key: 'entity', header: 'Entity', render: (row) => `${row.entity} #${row.entityId ?? '—'}` },
          { key: 'ipAddress', header: 'IP' },
        ]}
      />
    </div>
  );
}
