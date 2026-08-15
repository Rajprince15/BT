'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import BannerForm from '@/components/admin/BannerForm';
import adminBannerService from '@/services/admin/banner.service';
import type { Banner } from '@/types/Banner';

export default function AdminBannersPage() {
  const client = useQueryClient();
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: adminBannerService.list,
  });

  const [editing, setEditing] = useState<Banner | null>(null);
  const [creating, setCreating] = useState(false);

  const remove = async (banner: Banner) => {
    if (!confirm(`Delete banner "${banner.title}"?`)) return;
    try {
      await adminBannerService.remove(banner.id);
      await client.invalidateQueries({ queryKey: ['admin', 'banners'] });
      toast.success('Banner deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  return (
    <div data-testid="admin-banners-page" className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Content</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Banners</h1>
        </div>
        <button
          type="button"
          data-testid="admin-banner-new"
          onClick={() => {
            setEditing(null);
            setCreating(true);
          }}
          className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold"
        >
          New banner
        </button>
      </header>

      {(creating || editing) ? (
        <section className="grid gap-4">
          <BannerForm
            initial={editing ?? undefined}
            submitLabel={editing ? 'Save changes' : 'Create banner'}
            onSubmit={async (payload) => {
              if (editing) {
                await adminBannerService.update(editing.id, payload);
              } else {
                await adminBannerService.create(payload);
              }
              await client.invalidateQueries({ queryKey: ['admin', 'banners'] });
              setCreating(false);
              setEditing(null);
            }}
          />
          <button
            type="button"
            data-testid="admin-banner-cancel"
            onClick={() => {
              setCreating(false);
              setEditing(null);
            }}
            className="justify-self-end text-xs uppercase tracking-wider2 text-ink-2 hover:text-gold"
          >
            Cancel
          </button>
        </section>
      ) : null}

      <section className="grid gap-4">
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-2xl bg-surface-2" data-testid="admin-banners-loading" />
        ) : (
          banners.map((banner) => (
            <article
              key={banner.id}
              data-testid={`admin-banner-${banner.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider2 text-gold">{banner.placement}</p>
                <h2 className="mt-1 font-serif text-2xl text-ink">{banner.title}</h2>
                {banner.subtitle ? <p className="mt-1 text-sm text-ink-2">{banner.subtitle}</p> : null}
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-wider2">
                <span className={`rounded-full px-2 py-1 ${banner.isActive ? 'bg-success/15 text-success' : 'bg-surface-2 text-ink-2'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
                <button data-testid={`admin-banner-edit-${banner.id}`} onClick={() => { setEditing(banner); setCreating(false); }} className="text-gold hover:text-gold-2">
                  Edit
                </button>
                <button data-testid={`admin-banner-delete-${banner.id}`} onClick={() => remove(banner)} className="text-danger hover:opacity-70">
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
