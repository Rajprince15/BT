'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProductForm from '@/components/admin/ProductForm';
import adminProductService from '@/services/admin/product.service';
import adminCategoryService from '@/services/admin/category.service';

export default function AdminProductNewPage() {
  const router = useRouter();
  const client = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminCategoryService.list,
  });

  if (isLoading) {
    return <div data-testid="admin-product-new-loading" className="h-40 animate-pulse rounded-2xl bg-surface-2" />;
  }

  return (
    <div data-testid="admin-product-new-page" className="grid gap-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Catalog</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">New product</h1>
      </header>
      <ProductForm
        categories={categories}
        submitLabel="Create product"
        onSubmit={async (payload) => {
          const product = await adminProductService.create(payload);
          await client.invalidateQueries({ queryKey: ['admin', 'products'] });
          router.push(`/admin/products/${product.id}`);
        }}
      />
    </div>
  );
}
