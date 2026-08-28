'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import wishlistService from '@/services/wishlist.service';

export default function WishlistButton({ productId }: { productId: number }) { const client = useQueryClient(); const { data = [] } = useQuery({ queryKey: ['wishlist'], queryFn: wishlistService.get, retry: false }); const mutation = useMutation({ mutationFn: () => wishlistService.toggle(productId), onSuccess: (result) => { client.invalidateQueries({ queryKey: ['wishlist'] }); toast.success(result.removed ? 'Removed from wishlist' : 'Saved to wishlist'); }, onError: (error) => toast.error(error.message) }); const saved = data.some((item) => item.productId === productId); return <button type="button" data-testid="product-wishlist" aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={saved} onClick={() => mutation.mutate()} disabled={mutation.isPending} className={`inline-flex size-12 items-center justify-center border ${saved ? 'border-gold-2 text-gold-2' : 'border-border text-ink-2 hover:border-gold-2 hover:text-gold-2'}`}><Heart size={19} strokeWidth={1.4} fill={saved ? 'currentColor' : 'none'} /></button>; }