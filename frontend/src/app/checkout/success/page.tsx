'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';
import Container from '@/components/common/Container';
import { downloadInvoice } from '@/lib/invoice';

function SuccessContent() {
  const orderId = useSearchParams().get('orderId') || 'BT-DEMO-ORDER';
  const [busy, setBusy] = useState(false);
  const handleDownload = async () => { setBusy(true); try { await downloadInvoice(orderId); toast.success('Invoice downloaded'); } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not download invoice'); } finally { setBusy(false); } };
  return <div className="mx-auto max-w-2xl rounded-2xl border border-gold/40 bg-surface p-8 text-center shadow-luxe sm:p-14"><p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Thank you</p><h1 data-testid="checkout-success-title" className="mt-4 font-serif text-5xl text-ink">Your piece is on its way</h1><p className="mt-5 text-ink-2">Your order has been recorded and we&apos;ll keep you updated as it travels home.</p><p data-testid="checkout-order-number" className="mt-7 rounded bg-bg p-4 font-mono text-sm text-ink">Reference: {orderId}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><button type="button" data-testid="success-download-invoice" onClick={handleDownload} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 text-xs font-semibold uppercase tracking-wider2 text-ink transition-colors hover:bg-gold hover:text-bg disabled:opacity-60">{busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}{busy ? 'Preparing…' : 'Download invoice'}</button><Link data-testid="success-continue-shopping" href="/shop" className="rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold">Continue shopping</Link><Link data-testid="success-view-orders" href="/account/orders" className="rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider2 text-ink hover:border-gold">View orders</Link></div></div>;
}

export default function CheckoutSuccessPage() { return <main data-testid="checkout-success-page" className="bg-bg"><Container className="py-24"><Suspense fallback={<div data-testid="checkout-success-loading" className="mx-auto h-96 max-w-2xl animate-pulse rounded-2xl bg-surface-2" />}><SuccessContent /></Suspense></Container></main>; }