'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import adminWholesaleService from '@/services/admin/wholesale.service';
import type { WholesaleInquiry, WholesaleInquiryStatus } from '@/types/WholesaleInquiry';

const STATUSES: WholesaleInquiryStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];

function toCsv(rows: WholesaleInquiry[]) {
  const header = ['id', 'companyName', 'contactPerson', 'email', 'phone', 'businessType', 'productInterest', 'quantityRequirement', 'status', 'createdAt'];
  const escape = (value: unknown) => {
    const str = value === undefined || value === null ? '' : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  return [header.join(','), ...rows.map((row) => header.map((key) => escape(row[key as keyof WholesaleInquiry])).join(','))].join('\n');
}

export default function AdminWholesalePage() {
  const client = useQueryClient();
  const [status, setStatus] = useState<WholesaleInquiryStatus | ''>('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'wholesale', status],
    queryFn: () => adminWholesaleService.list({ status: status || undefined, pageSize: 100 }),
  });

  const updateStatus = async (row: WholesaleInquiry, next: WholesaleInquiryStatus) => {
    try {
      await adminWholesaleService.updateStatus(row.id, next);
      await client.invalidateQueries({ queryKey: ['admin', 'wholesale'] });
      toast.success(`Marked as ${next}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed');
    }
  };

  const exportCsv = () => {
    if (!data) return;
    const blob = new Blob([toCsv(data.items)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wholesale-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="admin-wholesale-page" className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">B2B pipeline</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Wholesale inquiries</h1>
        </div>
        <div className="flex gap-3">
          <select
            data-testid="admin-wholesale-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as WholesaleInquiryStatus | '')}
            className="h-11 rounded border border-border bg-surface px-3 text-sm outline-none focus:border-gold"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            data-testid="admin-wholesale-export"
            onClick={exportCsv}
            disabled={!data}
            className="inline-flex h-11 items-center rounded-full border border-border px-5 text-xs font-semibold uppercase tracking-wider2 text-ink hover:border-gold disabled:opacity-40"
          >
            Export CSV
          </button>
        </div>
      </header>

      <DataTable<WholesaleInquiry>
        testId="admin-wholesale-table"
        loading={isLoading}
        rows={data?.items ?? []}
        getRowId={(row) => row.id}
        columns={[
          { key: 'company', header: 'Company', render: (row) => (
            <div>
              <p className="font-serif text-base text-ink">{row.companyName}</p>
              <p className="text-xs uppercase tracking-wider2 text-ink-2">{row.businessType ?? '—'}</p>
            </div>
          ) },
          { key: 'contact', header: 'Contact', render: (row) => (
            <div className="text-xs text-ink-2">
              <p>{row.contactPerson}</p>
              <p>{row.email}</p>
              <p>{row.phone}</p>
            </div>
          ) },
          { key: 'productInterest', header: 'Interest', render: (row) => row.productInterest ?? '—' },
          { key: 'quantityRequirement', header: 'Qty', render: (row) => row.quantityRequirement ?? '—' },
          { key: 'status', header: 'Status', render: (row) => (
            <select
              data-testid={`admin-wholesale-set-${row.id}`}
              value={row.status}
              onChange={(event) => updateStatus(row, event.target.value as WholesaleInquiryStatus)}
              className="h-9 rounded border border-border bg-bg px-2 text-xs outline-none focus:border-gold"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) },
        ]}
      />
    </div>
  );
}
