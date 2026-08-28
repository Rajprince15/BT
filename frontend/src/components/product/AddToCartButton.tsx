'use client';

import { ShoppingBag } from 'lucide-react';
import { useAddToCart } from '@/hooks/useCart';
import { toast } from 'sonner';

export default function AddToCartButton({ productId, variantId, quantity = 1, disabled = false }: { productId: number; variantId?: number; quantity?: number; disabled?: boolean }) { const mutation = useAddToCart(); return <button type="button" data-testid="product-add-to-cart" disabled={disabled || mutation.isPending} onClick={() => mutation.mutate({ productId, variantId, quantity }, { onSuccess: () => toast.success('Added to your collection'), onError: (error) => toast.error(error.message) })} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-ink px-6 text-[10px] uppercase tracking-[0.2em] text-bg hover:bg-gold-2 hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag size={16} strokeWidth={1.4} />{mutation.isPending ? 'Adding…' : disabled ? 'Select an option' : 'Add to bag'}</button>; }