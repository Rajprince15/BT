'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthFrame from '@/components/auth/AuthFrame';
import authService from '@/services/auth.service';

function ResetPasswordForm() {
  const token = useSearchParams().get('token') || '';
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  return (
    <AuthFrame eyebrow="Account care" title="Choose a new password">
      <form
        data-testid="reset-password-form"
        className="mt-8 space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          await authService.resetPassword({ token, password });
          setDone(true);
          setTimeout(() => router.push('/auth/login'), 800);
        }}
      >
        {done ? (
          <p data-testid="reset-password-success" className="rounded border border-success/30 bg-success/10 p-4 text-sm text-success">
            Password updated. Returning to sign in…
          </p>
        ) : (
          <>
            <label className="block text-sm text-ink">
              New password
              <input data-testid="reset-password-input" required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded border border-border bg-bg px-4 focus:border-gold" />
            </label>
            <button data-testid="reset-password-submit" className="h-12 w-full rounded-full bg-ink text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold">
              Update password
            </button>
          </>
        )}
        <Link data-testid="reset-password-login-link" href="/auth/login" className="block text-center text-sm text-ink-2 hover:text-gold">
          Back to sign in
        </Link>
      </form>
    </AuthFrame>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div data-testid="reset-password-loading" className="min-h-[60vh] bg-bg" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}