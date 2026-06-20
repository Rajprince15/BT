'use client';

import { useEffect } from 'react';
import env from '@/lib/env';

export default function SentryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const dsn = env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;
    // Sentry is initialized via sentry.client.config.ts when DSN is set.
    // This provider only exists to keep a single integration point
    // and to attach user context once auth lands.
  }, []);

  return <>{children}</>;
}
