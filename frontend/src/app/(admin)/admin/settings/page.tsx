'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminSettingsService from '@/services/admin/settings.service';
import type { AdminSettings } from '@/services/admin/settings.service';
import { useAuthMe } from '@/hooks/useAuth';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data: user } = useAuthMe();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: adminSettingsService.get,
    enabled: user?.role === 'super_admin',
  });
  const [draft, setDraft] = useState<AdminSettings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  if (user && user.role !== 'super_admin') {
    return <p data-testid="admin-settings-forbidden" className="text-danger">Restricted to super administrators.</p>;
  }
  if (isLoading || !draft) {
    return <div data-testid="admin-settings-loading" className="h-40 animate-pulse rounded-2xl bg-surface-2" />;
  }

  const update = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) =>
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <div data-testid="admin-settings-page" className="grid gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Storefront controls</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Settings</h1>
      </header>

      <form
        className="grid gap-6 rounded-2xl border border-border bg-surface p-8"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          try {
            const saved = await adminSettingsService.update(draft);
            setDraft(saved);
            toast.success('Settings saved');
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed');
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-ink">
            Site name
            <input
              data-testid="settings-site-name"
              value={draft.siteName}
              onChange={(event) => update('siteName', event.target.value)}
              className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-ink">
            Contact email
            <input
              data-testid="settings-contact-email"
              type="email"
              value={draft.contactEmail}
              onChange={(event) => update('contactEmail', event.target.value)}
              className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-ink">
            Contact phone
            <input
              data-testid="settings-contact-phone"
              value={draft.contactPhone}
              onChange={(event) => update('contactPhone', event.target.value)}
              className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-ink">
            Shipping flat rate (₹)
            <input
              data-testid="settings-shipping-rate"
              type="number"
              value={draft.shippingFlatRate}
              onChange={(event) => update('shippingFlatRate', Number(event.target.value))}
              className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-ink">
            Free shipping threshold (₹)
            <input
              data-testid="settings-free-shipping"
              type="number"
              value={draft.freeShippingThreshold}
              onChange={(event) => update('freeShippingThreshold', Number(event.target.value))}
              className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-ink">
            Tax rate (0 – 1)
            <input
              data-testid="settings-tax-rate"
              type="number"
              step="0.001"
              value={draft.taxRate}
              onChange={(event) => update('taxRate', Number(event.target.value))}
              className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
            />
          </label>
        </div>

        <div className="grid gap-3">
          {(
            [
              ['razorpayEnabled', 'Enable Razorpay payments'],
              ['codEnabled', 'Allow cash on delivery'],
              ['maintenanceMode', 'Maintenance mode (site read-only)'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="inline-flex items-center gap-3 text-sm text-ink">
              <input
                data-testid={`settings-${key}`}
                type="checkbox"
                checked={Boolean(draft[key])}
                onChange={(event) => update(key, event.target.checked)}
                className="size-4"
              />
              {label}
            </label>
          ))}
        </div>

        <button
          type="submit"
          data-testid="settings-submit"
          disabled={busy}
          className="inline-flex h-12 items-center justify-center self-start rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
