'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useChangePassword } from '@/hooks/useAuth';

const MIN_LENGTH = 8;

function checkStrength(password: string): { label: string; tone: string; score: number } {
  let score = 0;
  if (password.length >= MIN_LENGTH) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const label = ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent'][score];
  const tone = ['bg-danger', 'bg-danger', 'bg-gold', 'bg-gold-2', 'bg-success'][score];
  return { label, tone, score };
}

export default function ChangePasswordForm() {
  const mutation = useChangePassword();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const strength = checkStrength(next);
  const mismatch = confirm.length > 0 && confirm !== next;

  return (
    <form
      data-testid="change-password-form"
      className="grid max-w-xl gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (mismatch) return;
        if (strength.score < 2) {
          toast.error('Please choose a stronger password.');
          return;
        }
        mutation.mutate(
          { currentPassword: current, newPassword: next },
          {
            onSuccess: () => {
              toast.success('Password updated');
              setCurrent('');
              setNext('');
              setConfirm('');
            },
            onError: (error) => toast.error(error.message),
          },
        );
      }}
    >
      <label className="grid gap-2 text-sm text-ink">
        Current password
        <input
          data-testid="change-password-current"
          type="password"
          required
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="h-12 rounded border border-border bg-surface px-4 outline-none transition-colors focus:border-gold"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink">
        New password
        <input
          data-testid="change-password-next"
          type="password"
          required
          minLength={MIN_LENGTH}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="h-12 rounded border border-border bg-surface px-4 outline-none transition-colors focus:border-gold"
        />
        {next ? (
          <div data-testid="change-password-strength" className="mt-1 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded bg-border">
              <div className={`h-full transition-all ${strength.tone}`} style={{ width: `${(strength.score / 4) * 100}%` }} />
            </div>
            <span className="text-[11px] uppercase tracking-wider2 text-ink-2">{strength.label}</span>
          </div>
        ) : null}
      </label>
      <label className="grid gap-2 text-sm text-ink">
        Confirm new password
        <input
          data-testid="change-password-confirm"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="h-12 rounded border border-border bg-surface px-4 outline-none transition-colors focus:border-gold"
        />
        {mismatch ? (
          <p data-testid="change-password-mismatch" className="text-xs text-danger">
            Passwords do not match.
          </p>
        ) : null}
      </label>

      <button
        type="submit"
        data-testid="change-password-submit"
        disabled={mutation.isPending || mismatch || !next}
        className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:opacity-50"
      >
        {mutation.isPending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
