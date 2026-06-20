'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import productService from '@/services/product.service';
import categoryService from '@/services/category.service';
import { useUIStore } from '@/store/ui.store';
import type { Product } from '@/types/Product';
import type { Category } from '@/types/Category';

export default function SearchCommand() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Run search
  useEffect(() => {
    if (!debounced) {
      setProducts([]);
      setCategories([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      productService.search(debounced),
      categoryService.tree(),
    ])
      .then(([res, tree]) => {
        if (cancelled) return;
        const items = 'items' in res ? res.items : (res as { items: Product[] }).items;
        setProducts(items.slice(0, 6));
        const lc = debounced.toLowerCase();
        setCategories(tree.filter((c) => c.name.toLowerCase().includes(lc)).slice(0, 5));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      data-testid="global-search-dialog"
      title="Search BHAVITA TEXTILES"
      description="Find products and categories"
    >
      <CommandInput
        data-testid="global-search-input"
        placeholder="Search bedsheets, curtains, handloom…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="px-4 py-6 text-center text-[12px] uppercase tracking-[0.2em] text-[var(--ink-2)]">
            Searching…
          </div>
        )}
        {!loading && debounced && products.length === 0 && categories.length === 0 && (
          <CommandEmpty>
            <span className="font-serif text-base text-[var(--ink-2)]">
              No results for &ldquo;{debounced}&rdquo;
            </span>
          </CommandEmpty>
        )}

        {products.length > 0 && (
          <CommandGroup heading="Products">
            {products.map((p) => (
              <CommandItem
                key={p.id}
                data-testid={`global-search-result-${p.id}`}
                value={`product-${p.id}-${p.name}`}
                onSelect={() => go(`/product/${p.slug}`)}
                className="flex items-center gap-3"
              >
                {p.images?.[0]?.imageUrl ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-[var(--gold-soft)]">
                    <Image
                      src={p.images[0].imageUrl}
                      alt={p.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 shrink-0 bg-[var(--surface-2)]" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-sm text-[var(--ink)]">{p.name}</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]">
                    ₹{(p.salePrice ?? p.price).toLocaleString('en-IN')}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {categories.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Categories">
              {categories.map((c) => (
                <CommandItem
                  key={c.id}
                  data-testid={`global-search-category-${c.slug}`}
                  value={`category-${c.slug}-${c.name}`}
                  onSelect={() => go(`/shop/${c.slug}`)}
                >
                  <Search size={14} className="text-[var(--gold)]" />
                  <span className="font-sans text-sm">{c.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {debounced && (products.length > 0 || categories.length > 0) && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                data-testid="global-search-view-all"
                value={`view-all-${debounced}`}
                onSelect={() => go(`/search?q=${encodeURIComponent(debounced)}`)}
              >
                <span className="font-sans text-[12px] uppercase tracking-[0.22em] text-[var(--gold)]">
                  View all results for &ldquo;{debounced}&rdquo;
                </span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
