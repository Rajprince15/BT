/**
 * Lightweight slug + text utilities shared across modules.
 */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function ensureUniqueSlug(base: string, exists: (slug: string) => Promise<boolean>): Promise<string> {
  const root = slugify(base);
  if (!(await exists(root))) return root;
  let n = 2;
  while (n < 1000) {
    const candidate = `${root}-${n}`;
    if (!(await exists(candidate))) return candidate;
    n += 1;
  }
  throw new Error('Unable to allocate unique slug');
}
