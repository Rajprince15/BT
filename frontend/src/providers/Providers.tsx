'use client';

import ThemeProvider from '@/providers/ThemeProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import SentryProvider from '@/providers/SentryProvider';
import Toaster from '@/components/common/Toaster';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SentryProvider>
      <ReactQueryProvider>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </ReactQueryProvider>
    </SentryProvider>
  );
}
