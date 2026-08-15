'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { useSubmitReview } from '@/hooks/useReviews';

interface WriteReviewProps {
  productId: number;
  onSubmitted?: () => void;
}

export default function WriteReview({ productId, onSubmitted }: WriteReviewProps) {
  const mutation = useSubmitReview();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <form
      data-testid="write-review-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!rating) {
          toast.error('Please choose a rating');
          return;
        }
        mutation.mutate(
          { productId, rating, title: title || undefined, review: body || undefined },
          {
            onSuccess: () => {
              toast.success('Your review has been submitted for moderation.');
              setTitle('');
              setBody('');
              setRating(5);
              onSubmitted?.();
            },
            onError: (error) => toast.error(error.message),
          },
        );
      }}
      className="grid gap-5 rounded-xl border border-border bg-surface p-6"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Share your experience</p>
        <h3 className="mt-2 font-serif text-2xl text-ink">Write a review</h3>
      </div>

      <fieldset data-testid="write-review-rating" className="flex items-center gap-2" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            data-testid={`write-review-rating-${value}`}
            aria-label={`${value} star${value > 1 ? 's' : ''}`}
            aria-pressed={value <= rating}
            onClick={() => setRating(value)}
            className="rounded-full p-1 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Star className={`size-6 ${value <= rating ? 'fill-gold text-gold' : 'text-ink-2'}`} strokeWidth={1.5} />
          </button>
        ))}
      </fieldset>

      <label className="grid gap-2 text-sm text-ink">
        Title
        <input
          data-testid="write-review-title"
          type="text"
          maxLength={180}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-12 rounded border border-border bg-bg px-4 outline-none transition-colors focus:border-gold"
          placeholder="A short summary"
        />
      </label>

      <label className="grid gap-2 text-sm text-ink">
        Your review
        <textarea
          data-testid="write-review-body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-[120px] rounded border border-border bg-bg p-4 outline-none transition-colors focus:border-gold"
          placeholder="How does the piece live in your home?"
        />
      </label>

      <button
        type="submit"
        data-testid="write-review-submit"
        disabled={mutation.isPending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:opacity-50"
      >
        {mutation.isPending ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
