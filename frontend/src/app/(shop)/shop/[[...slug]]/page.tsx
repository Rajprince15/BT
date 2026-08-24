
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ShopBrowser from '@/components/shop/ShopBrowser';
import categoryService from '@/services/category.service';
import env from '@/lib/env';

import type { BreadcrumbItem } from '@/components/shop/Breadcrumbs';

interface ShopPageProps {
  params: Promise<{ slug?: string[] }>;
}

async function getCategories() {
  return categoryService.tree();
}

function findCategory(
  categories: Awaited<ReturnType<typeof getCategories>>,
  slug?: string
) {
  if (!slug) {
    return null;
  }

  return categories.find(
    (category) => category.slug === slug
  ) ?? null;
}

function buildCrumbs(
  categories: Awaited<ReturnType<typeof getCategories>>,
  slugChain: string[] = []
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Catalogue',
      href: '/shop',
    },
  ];

  let path = '/shop';

  for (const slug of slugChain) {
    const category = categories.find(
      (item) => item.slug === slug
    );

    if (!category) {
      continue;
    }

    path += `/${slug}`;

    crumbs.push({
      label: category.name,
      href: path,
    });
  }

  return crumbs;
}

function isValidCategoryPath(
  categories: Awaited<ReturnType<typeof getCategories>>,
  slugChain: string[] = []
) {
  let parentId: number | undefined;

  return slugChain.every((slug) => {
    const category = categories.find(
      (item) => item.slug === slug
    );

    if (
      !category ||
      (parentId !== undefined &&
        category.parentId !== parentId)
    ) {
      return false;
    }

    parentId = category.id;

    return true;
  });
}

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;

  const last = slug?.[slug.length - 1];

  const categories = await getCategories();

  if (
    slug?.length &&
    !isValidCategoryPath(categories, slug)
  ) {
    notFound();
  }

  const category = findCategory(categories, last);

  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  const path =
    slug && slug.length > 0
      ? `/shop/${slug.join('/')}`
      : '/shop';

  /*
   * Default /shop metadata
   */
  if (!category) {
    return {
      title: 'Product Catalogue · Bhavita Textiles',
      description:
        'Browse Bhavita Textiles bulk home-textile products, specifications, sizes and MOQs.',
      alternates: {
        canonical: `${baseUrl}/shop`,
      },
    };
  }

  /*
   * Category-specific metadata
   */
  return {
    title: `${category.name} · Bhavita Textiles`,
    description:
      category.description ??
      `${category.name} — handcrafted, premium textiles by Bhavita Textiles.`,
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
  };
}

export default async function Page({
  params,
}: ShopPageProps) {
  const { slug } = await params;

  const last = slug?.[slug.length - 1];

  const categories = await getCategories();

  if (
    slug?.length &&
    !isValidCategoryPath(categories, slug)
  ) {
    notFound();
  }

  const category = findCategory(categories, last);

  /*
   * Default /shop catalogue content
   */
  const title = category
    ? category.name
    : 'Product Catalogue';

  const eyebrow = category
    ? 'Shop'
    : 'Bulk home textiles · 30+ SKUs';

  const description = category
    ? category.description
    : 'Browse printed bedsheets, mink blankets, floor mats, comforters, pillow covers, towels and furnishing panels — with technical specs and MOQ details for every range.';

  return (
    <Suspense
      fallback={<div className="min-h-screen bg-bg" />}
    >
      <ShopBrowser
        title={title}
        eyebrow={eyebrow}
        description={description}
        breadcrumbs={buildCrumbs(categories, slug)}
        lockedCategorySlug={category?.slug}
        limit={!category ? 12 : undefined}
      />
    </Suspense>
  );
}
