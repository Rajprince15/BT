'use client';

import { MessageCircle } from 'lucide-react';
import { env } from '@/lib/env';

export const WHATSAPP_NUMBER = env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export const WHATSAPP_MESSAGE =
  'Hello, I’m interested in your products.';

export const whatsappUrl = (
  message = WHATSAPP_MESSAGE
) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export default function WhatsAppWidget() {
  return (
    <div className="group fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        data-testid="whatsapp-widget"
        aria-label="Chat with us on WhatsApp"
        className="relative inline-flex size-14 items-center justify-center rounded-full bg-brand text-brand-ink shadow-[0_16px_30px_-12px_rgba(125,44,40,.6)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold"
      >
        <MessageCircle className="size-6" />

        <span className="absolute right-0 top-0 size-3 rounded-full bg-gold ring-2 ring-bg group-hover:hidden" />
      </a>

      <span
        data-testid="whatsapp-widget-tooltip"
        className="pointer-events-none absolute bottom-full right-0 mb-3 w-max rounded-md bg-ink px-3 py-2 text-xs text-bg opacity-0 transition-opacity group-hover:opacity-100"
      >
        Chat with us on WhatsApp
      </span>
    </div>
  );
}