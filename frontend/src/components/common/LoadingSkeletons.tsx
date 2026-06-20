import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
  return (
    <div data-testid="card-skeleton" className="space-y-3">
      <Skeleton className="aspect-[3/4] w-full rounded-sm" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      data-testid="list-skeleton"
      className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div data-testid="text-skeleton" className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}

export function CountBadgeSkeleton() {
  return <Skeleton data-testid="count-skeleton" className="h-4 w-4 rounded-full" />;
}
