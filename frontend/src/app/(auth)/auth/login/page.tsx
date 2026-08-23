'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthFrame from '@/components/auth/AuthFrame';
import { useLogin } from '@/hooks/useAuth';

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') || '/account';
  const mutation = useLogin();
  const [email, setEmail] = useState('customer@bhavita.test');
  const [password, setPassword] = useState('Customer@123');
  return <form data-testid="login-form" className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); mutation.mutate({ email, password }, { onSuccess: () => router.push(next) }); }}>
    <label className="block text-sm text-ink">Email<input data-testid="login-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded border border-border bg-bg px-4 outline-none focus:border-gold" /></label>
    <label className="block text-sm text-ink">Password<input data-testid="login-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded border border-border bg-bg px-4 outline-none focus:border-gold" /></label>
    {mutation.isError ? <p data-testid="login-error" className="text-sm text-danger">{mutation.error.message}</p> : null}
    <button data-testid="login-submit" disabled={mutation.isPending} className="h-12 w-full rounded-full bg-ink text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold disabled:opacity-50">{mutation.isPending ? 'Entering…' : 'Sign in'}</button>
    <div className="flex justify-between text-sm text-ink-2"><Link data-testid="forgot-password-link" href="/auth/forgot-password" className="hover:text-gold">Forgot password?</Link><Link data-testid="register-link" href="/auth/register" className="hover:text-gold">Create account</Link></div>
  </form>;
}

export default function LoginPage() {
  return <AuthFrame eyebrow="Welcome back" title="Enter the atelier"><Suspense fallback={<div data-testid="login-loading" className="mt-8 h-48 animate-pulse rounded-xl bg-surface-2" />}><LoginForm /></Suspense></AuthFrame>;
}