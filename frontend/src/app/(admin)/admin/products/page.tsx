'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import adminProductService from '@/services/admin/product.service';
import type { Product, ProductStatus } from '@/types/Product';

const STATUS_OPTIONS: Array<ProductStatus | ''> = ['', 'draft', 'published', 'archived'];

export default function AdminProductsPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState<ProductStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', { status, search, page }],
    queryFn: () => adminProductService.list({ status: status || undefined, search: search || undefined, page, pageSize: 20 }),
  });

  const remove = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await adminProductService.remove(product.id);
      await client.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  return (
    <div data-testid="admin-products-page" className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Catalog</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          data-testid="admin-products-new"
          className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold"
        >
          New product
        </Link>
      </header>

      <div className="flex flex-wrap gap-3">
        <input
          data-testid="admin-products-search"
          placeholder="Search by name or SKU"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="h-11 flex-1 min-w-[220px] rounded border border-border bg-surface px-4 text-sm outline-none focus:border-gold"
        />
        <select
          data-testid="admin-products-status-filter"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as ProductStatus | '');
            setPage(1);
          }}
          className="h-11 rounded border border-border bg-surface px-3 text-sm outline-none focus:border-gold"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option || 'all'} value={option}>
              {option || 'All statuses'}
            </option>
          ))}
        </select>
      </div>

      <DataTable<Product>
        testId="admin-products-table"
        loading={isLoading}
        rows={data?.items ?? []}
        getRowId={(row) => row.id}
        columns={[
          { key: 'name', header: 'Product', render: (row) => (
            <div>
              <p className="font-serif text-base text-ink">{row.name}</p>
              <p className="text-xs uppercase tracking-wider2 text-ink-2">{row.sku}</p>
            </div>
          ) },
          { key: 'price', header: 'Price', align: 'right', render: (row) => `₹${(row.salePrice ?? row.price).toLocaleString('en-IN')}` },
          { key: 'stock', header: 'Stock', align: 'right', render: (row) => row.stock },
          { key: 'status', header: 'Status', render: (row) => (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 ${row.status === 'published' ? 'bg-success/15 text-success' : row.status === 'archived' ? 'bg-danger/15 text-danger' : 'bg-surface-2 text-ink-2'}`}>
              {row.status}
            </span>
          ) },
          { key: 'actions', header: '', align: 'right', render: (row) => (
            <div className="flex justify-end gap-3 text-xs uppercase tracking-wider2">
              <Link data-testid={`admin-product-edit-${row.id}`} href={`/admin/products/${row.id}`} className="text-gold hover:text-gold-2">Edit</Link>
              <button data-testid={`admin-product-delete-${row.id}`} onClick={() => remove(row)} className="text-danger hover:opacity-70">Delete</button>
            </div>
          ) },
        ]}
      />

      {data && data.meta.totalPages > 1 ? (
        <div className="flex justify-end gap-2">
          <button
            data-testid="admin-products-prev"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-9 rounded-full border border-border px-4 text-xs uppercase tracking-wider2 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="inline-flex items-center px-3 text-xs text-ink-2">
            {page} / {data.meta.totalPages}
          </span>
          <button
            data-testid="admin-products-next"
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
            className="h-9 rounded-full border border-border px-4 text-xs uppercase tracking-wider2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
