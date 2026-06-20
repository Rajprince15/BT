import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import env from '@/lib/env';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const ldItems = items
    .filter((i) => !!i.href)
    .map((i, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: i.label,
      item: `${env.NEXT_PUBLIC_APP_URL}${i.href}`,
    }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: ldItems,
  };

  return (
    <nav
      data-testid="breadcrumb-trail"
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 py-4 font-sans text-[12px] uppercase tracking-[0.18em] text-[var(--ink-2)]"
    >
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        return (
          <span key={`${item.label}-${idx}`} className="flex items-center gap-1">
            {item.href && !last ? (
              <Link href={item.href} className="hover:text-[var(--gold)]">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'text-[var(--gold)]' : ''}>{item.label}</span>
            )}
            {!last && <ChevronRight size={12} className="text-[var(--gold)]" />}
          </span>
        );
      })}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
