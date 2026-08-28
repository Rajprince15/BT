'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import wishlistService from '@/services/wishlist.service';

export default function WishlistButton({ productId }: { productId: number }) {
  const client = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['wishlist'], queryFn: wishlistService.get, retry: false });
  const mutation = useMutation({ mutationFn: () => wishlistService.toggle(productId), onSuccess: (result) => { client.invalidateQueries({ queryKey: ['wishlist'] }); toast.success(result.removed ? 'Removed from wishlist' : 'Saved to wishlist'); }, onError: (error) => toast.error(error.message) });
  const saved = data.some((item) => item.productId === productId);
  return <button type="button" data-testid="product-wishlist" aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => mutation.mutate()} disabled={mutation.isPending} className={`inline-flex size-12 items-center justify-center rounded-full border transition-colors ${saved ? 'border-gold bg-gold-soft/40 text-gold' : 'border-border text-ink-2 hover:border-gold hover:text-gold'}`}><Heart className="size-5" fill={saved ? 'currentColor' : 'none'} /></button>;
}