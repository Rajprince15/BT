import createDOMPurify from 'dompurify';
// jsdom ships without types on some setups; use a permissive shape here.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { JSDOM } = require('jsdom') as { JSDOM: new (html: string) => { window: unknown } };

const window = new JSDOM('').window;
const purify = createDOMPurify(window as never);

/**
 * Server-side HTML sanitization for user-submitted rich text
 * (product descriptions, reviews, wholesale messages, etc).
 */
export function sanitizeHtml(input: string): string {
  return purify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'h4', 'blockquote'],
    ALLOWED_ATTR: ['href', 'title', 'rel', 'target'],
  });
}

/** Strip HTML entirely — for plain-text fields that arrive with tags. */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
