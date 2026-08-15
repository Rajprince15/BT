'use client';

import { ShoppingBag } from 'lucide-react';
import { useAddToCart } from '@/hooks/useCart';
import { toast } from 'sonner';

export default function AddToCartButton({ productId, variantId, quantity = 1, disabled = false }: { productId: number; variantId?: number; quantity?: number; disabled?: boolean }) {
  const mutation = useAddToCart();
  return <button type="button" data-testid="product-add-to-cart" disabled={disabled || mutation.isPending} onClick={() => mutation.mutate({ productId, variantId, quantity }, { onSuccess: () => toast.success('Added to your collection'), onError: (error) => toast.error(error.message) })} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag className="size-4" />{mutation.isPending ? 'Adding…' : disabled ? 'Select an option' : 'Add to bag'}</button>;
}