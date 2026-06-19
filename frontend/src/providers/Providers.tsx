'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ThemeProvider from '@/providers/ThemeProvider';
import { queryClient } from '@/lib/react-query';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors toastOptions={{ duration: 4500 }} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
