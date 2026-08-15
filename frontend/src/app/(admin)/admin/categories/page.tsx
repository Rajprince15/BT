'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import adminCategoryService from '@/services/admin/category.service';
import type { Category } from '@/types/Category';

interface Draft {
  name: string;
  slug: string;
  parentId: number | '';
  isActive: boolean;
}

const EMPTY: Draft = { name: '', slug: '', parentId: '', isActive: true };
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function AdminCategoriesPage() {
  const client = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminCategoryService.list,
  });

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!draft.name || !draft.slug) {
      toast.error('Name and slug are required.');
      return;
    }
    setBusy(true);
    try {
      await adminCategoryService.create({
        name: draft.name,
        slug: draft.slug,
        parentId: draft.parentId === '' ? undefined : Number(draft.parentId),
        isActive: draft.isActive,
      });
      await client.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Category created');
      setDraft(EMPTY);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (category: Category) => {
    if (!confirm(`Delete "${category.name}"?`)) return;
    try {
      await adminCategoryService.remove(category.id);
      await client.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Category deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed');
    }
  };

  return (
    <div data-testid="admin-categories-page" className="grid gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Catalog structure</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Categories</h1>
      </header>

      <section className="grid gap-4 rounded-xl border border-border bg-surface p-6 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm text-ink">
          Name
          <input
            data-testid="admin-category-name"
            value={draft.name}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, name: event.target.value, slug: prev.slug || slugify(event.target.value) }))
            }
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Slug
          <input
            data-testid="admin-category-slug"
            value={draft.slug}
            onChange={(event) => setDraft((prev) => ({ ...prev, slug: slugify(event.target.value) }))}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Parent
          <select
            data-testid="admin-category-parent"
            value={draft.parentId}
            onChange={(event) => setDraft((prev) => ({ ...prev, parentId: event.target.value === '' ? '' : Number(event.target.value) }))}
            className="h-11 rounded border border-border bg-bg px-3 outline-none focus:border-gold"
          >
            <option value="">Top-level</option>
            {categories.filter((c) => !c.parentId).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          data-testid="admin-category-add"
          onClick={create}
          disabled={busy}
          className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Add category'}
        </button>
      </section>

      <DataTable<Category>
        testId="admin-categories-table"
        loading={isLoading}
        rows={categories}
        getRowId={(row) => row.id}
        columns={[
          { key: 'name', header: 'Name', render: (row) => (
            <div>
              <p className="font-serif text-base text-ink">{row.name}</p>
              <p className="text-xs uppercase tracking-wider2 text-ink-2">{row.slug}</p>
            </div>
          ) },
          { key: 'parentId', header: 'Parent', render: (row) => categories.find((c) => c.id === row.parentId)?.name ?? '—' },
          { key: 'isActive', header: 'Active', render: (row) => (row.isActive ? 'Yes' : 'No') },
          { key: 'actions', header: '', align: 'right', render: (row) => (
            <button
              data-testid={`admin-category-delete-${row.id}`}
              onClick={() => remove(row)}
              className="text-xs uppercase tracking-wider2 text-danger hover:opacity-70"
            >
              Delete
            </button>
          ) },
        ]}
      />
    </div>
  );
}
