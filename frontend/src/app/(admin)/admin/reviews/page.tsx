'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReviewModerationRow from '@/components/admin/ReviewModerationRow';
import adminReviewService from '@/services/admin/review.service';
import { products } from '@/mocks/products.mock';
import { users } from '@/mocks/users.mock';
import type { ReviewStatus } from '@/types/Review';

const TABS: Array<{ label: string; value: ReviewStatus | 'all' }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
];

export default function AdminReviewsPage() {
  const [status, setStatus] = useState<ReviewStatus | 'all'>('pending');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reviews', status],
    queryFn: () => adminReviewService.list({ status: status === 'all' ? undefined : status, pageSize: 50 }),
  });

  return (
    <div data-testid="admin-reviews-page" className="grid gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Voice of customer</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Reviews</h1>
      </header>

      <nav className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            data-testid={`admin-reviews-tab-${tab.value}`}
            onClick={() => setStatus(tab.value)}
            className={`h-10 rounded-full px-4 text-xs font-semibold uppercase tracking-wider2 transition-colors ${
              status === tab.value ? 'bg-ink text-bg' : 'border border-border text-ink-2 hover:border-gold'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-surface-2" data-testid="admin-reviews-loading" />
      ) : (
        <div className="grid gap-4">
          {(data?.items ?? []).map((review) => {
            const product = products.find((p) => p.id === review.productId);
            const author = users.find((u) => u.id === review.userId);
            return (
              <ReviewModerationRow
                key={review.id}
                review={review}
                productName={product?.name}
                authorName={author?.name}
              />
            );
          })}
          {data && data.items.length === 0 ? (
            <p data-testid="admin-reviews-empty" className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-ink-2">
              No reviews match this filter.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
