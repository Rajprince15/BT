'use client';

import { Toaster as Sonner } from 'sonner';

export default function Toaster() {
  return (
    <Sonner
      data-testid="brand-toaster"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4500,
        className: 'font-sans',
        style: {
          background: 'var(--surface)',
          color: 'var(--ink)',
          border: '1px solid var(--gold)',
          borderRadius: '4px',
          fontFamily: 'var(--font-sans)',
        },
      }}
    />
  );
}
