'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthFrame from '@/components/auth/AuthFrame';
import authService from '@/services/auth.service';

function VerifyEmailContent() {
  const token = useSearchParams().get('token') || 'demo-token';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    authService.verifyEmail(token)
      .then((result) => setStatus(result.success ? 'success' : 'error'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <AuthFrame eyebrow="One final detail" title="Verify your email">
      <div data-testid="verify-email-state" className="mt-8 rounded border border-border bg-bg p-6 text-sm leading-7 text-ink-2">
        {status === 'loading' ? 'Confirming your email…' : status === 'success' ? 'Your email is verified. You can now sign in and continue collecting pieces for your home.' : 'This verification link is no longer valid.'}
      </div>
      <Link data-testid="verify-email-login-link" href="/auth/login" className="mt-6 block text-center text-sm text-gold">
        Continue to sign in
      </Link>
    </AuthFrame>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div data-testid="verify-email-loading" className="min-h-[60vh] bg-bg" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}