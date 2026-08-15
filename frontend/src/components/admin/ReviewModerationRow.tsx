'use client';

import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Check, X, Star } from 'lucide-react';
import type { Review, ReviewStatus } from '@/types/Review';
import adminReviewService from '@/services/admin/review.service';

const STATUS_STYLE: Record<ReviewStatus, string> = {
  pending: 'bg-gold-soft text-ink',
  approved: 'bg-success/15 text-success',
  rejected: 'bg-danger/15 text-danger',
};

interface ReviewModerationRowProps {
  review: Review;
  productName?: string;
  authorName?: string;
}

export default function ReviewModerationRow({ review, productName, authorName }: ReviewModerationRowProps) {
  const client = useQueryClient();

  const moderate = async (status: ReviewStatus) => {
    try {
      await adminReviewService.moderate(review.id, status);
      await client.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success(`Review ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to moderate review');
    }
  };

  return (
    <article
      data-testid={`review-moderation-${review.id}`}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 md:flex-row md:items-start"
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span data-testid={`review-status-${review.id}`} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 ${STATUS_STYLE[review.status]}`}>
            {review.status}
          </span>
          <span data-testid={`review-rating-${review.id}`} className="inline-flex items-center gap-1 text-xs text-ink-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < review.rating ? 'fill-gold text-gold' : 'text-border'}`}
                strokeWidth={1.5}
              />
            ))}
          </span>
        </div>
        <h3 className="mt-2 font-serif text-lg text-ink">{review.title ?? 'Untitled review'}</h3>
        <p className="mt-1 text-xs uppercase tracking-wider2 text-ink-2">
          {productName ?? `Product #${review.productId}`}
          {authorName ? ` · by ${authorName}` : null}
        </p>
        {review.review ? <p className="mt-3 text-sm leading-6 text-ink-2">{review.review}</p> : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          data-testid={`review-approve-${review.id}`}
          disabled={review.status === 'approved'}
          onClick={() => moderate('approved')}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-success/40 bg-success/10 px-4 text-xs font-semibold uppercase tracking-wider2 text-success transition-colors hover:bg-success hover:text-bg disabled:opacity-40"
        >
          <Check className="size-4" /> Approve
        </button>
        <button
          type="button"
          data-testid={`review-reject-${review.id}`}
          disabled={review.status === 'rejected'}
          onClick={() => moderate('rejected')}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-danger/40 bg-danger/10 px-4 text-xs font-semibold uppercase tracking-wider2 text-danger transition-colors hover:bg-danger hover:text-bg disabled:opacity-40"
        >
          <X className="size-4" /> Reject
        </button>
      </div>
    </article>
  );
}
