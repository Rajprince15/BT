'use client';

import { MessageCircle } from 'lucide-react';

// Replace this placeholder with the owner's WhatsApp number, including country code.
export const WHATSAPP_NUMBER = '919852244801';
export const WHATSAPP_MESSAGE = 'Hello, I’m interested in your products.';
export const whatsappUrl = (message = WHATSAPP_MESSAGE) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export default function WhatsAppWidget() {
  return <a href={whatsappUrl()} target="_blank" rel="noreferrer" data-testid="whatsapp-floating-button" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[#1f9d58] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-xl transition-transform hover:-translate-y-1 hover:bg-[#18834a] sm:bottom-7 sm:right-7"><MessageCircle size={19} /> <span className="hidden sm:inline">Chat with us</span></a>;
}