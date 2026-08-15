'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import adminCustomerService from '@/services/admin/customer.service';
import type { AdminCustomerWithStats } from '@/services/admin/customer.service';
import type { UserStatus } from '@/types/User';

const STATUS_OPTIONS: Array<UserStatus | ''> = ['', 'active', 'suspended', 'deleted'];

export default function AdminCustomersPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState<UserStatus | ''>('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers', { status, search }],
    queryFn: () =>
      adminCustomerService.list({
        status: status || undefined,
        search: search || undefined,
      }),
  });

  const toggle = async (customer: AdminCustomerWithStats) => {
    try {
      if (customer.status === 'suspended') {
        await adminCustomerService.activate(customer.id);
        toast.success(`${customer.name} activated`);
      } else {
        await adminCustomerService.suspend(customer.id);
        toast.success(`${customer.name} suspended`);
      }
      await client.invalidateQueries({ queryKey: ['admin', 'customers'] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed');
    }
  };

  return (
    <div data-testid="admin-customers-page" className="grid gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">People</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Customers</h1>
      </header>

      <div className="flex flex-wrap gap-3">
        <input
          data-testid="admin-customers-search"
          placeholder="Search name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-11 flex-1 min-w-[220px] rounded border border-border bg-surface px-4 text-sm outline-none focus:border-gold"
        />
        <select
          data-testid="admin-customers-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as UserStatus | '')}
          className="h-11 rounded border border-border bg-surface px-3 text-sm outline-none focus:border-gold"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option || 'all'} value={option}>
              {option || 'All statuses'}
            </option>
          ))}
        </select>
      </div>

      <DataTable<AdminCustomerWithStats>
        testId="admin-customers-table"
        loading={isLoading}
        rows={data?.items ?? []}
        getRowId={(row) => row.id}
        columns={[
          { key: 'name', header: 'Customer', render: (row) => (
            <div>
              <p className="font-serif text-base text-ink">{row.name}</p>
              <p className="text-xs uppercase tracking-wider2 text-ink-2">{row.email}</p>
            </div>
          ) },
          { key: 'orderCount', header: 'Orders', align: 'right', render: (row) => row.orderCount },
          { key: 'totalSpent', header: 'Lifetime value', align: 'right', render: (row) => `₹${row.totalSpent.toLocaleString('en-IN')}` },
          { key: 'status', header: 'Status', render: (row) => (
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider2 ${row.status === 'active' ? 'bg-success/15 text-success' : row.status === 'suspended' ? 'bg-danger/15 text-danger' : 'bg-surface-2 text-ink-2'}`}>
              {row.status}
            </span>
          ) },
          { key: 'actions', header: '', align: 'right', render: (row) => (
            <button
              data-testid={`admin-customer-toggle-${row.id}`}
              onClick={() => toggle(row)}
              className="text-xs uppercase tracking-wider2 text-gold hover:text-gold-2"
            >
              {row.status === 'suspended' ? 'Activate' : 'Suspend'}
            </button>
          ) },
        ]}
      />
    </div>
  );
}
