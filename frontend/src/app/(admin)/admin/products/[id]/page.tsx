'use client';

import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProductForm from '@/components/admin/ProductForm';
import adminProductService from '@/services/admin/product.service';
import adminCategoryService from '@/services/admin/category.service';

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const client = useQueryClient();

  const productQuery = useQuery({
    queryKey: ['admin', 'product', productId],
    queryFn: () => adminProductService.byId(productId),
    enabled: Number.isFinite(productId),
  });
  const categoriesQuery = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminCategoryService.list,
  });

  if (productQuery.isLoading || categoriesQuery.isLoading) {
    return <div data-testid="admin-product-edit-loading" className="h-40 animate-pulse rounded-2xl bg-surface-2" />;
  }
  if (!productQuery.data) {
    return <p data-testid="admin-product-not-found" className="text-danger">Product not found.</p>;
  }

  return (
    <div data-testid="admin-product-edit-page" className="grid gap-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Catalog</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Edit product</h1>
        <p className="mt-2 text-sm text-ink-2">SKU {productQuery.data.sku}</p>
      </header>
      <ProductForm
        initial={productQuery.data}
        categories={categoriesQuery.data ?? []}
        submitLabel="Save changes"
        onSubmit={async (payload) => {
          await adminProductService.update(productId, payload);
          await client.invalidateQueries({ queryKey: ['admin', 'product', productId] });
          await client.invalidateQueries({ queryKey: ['admin', 'products'] });
        }}
      />
    </div>
  );
}
