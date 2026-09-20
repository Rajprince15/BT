import type { Product } from '@/types/Product';
import type { ProductImage } from '@/types/ProductImage';
import type { ProductVariant } from '@/types/ProductVariant';
import { categoryIds } from '@/mocks/categories.mock';
import { mockImage } from '@/mocks/_images';

const NOW = '2025-12-15T10:00:00.000Z';
let pid = 0; let iid = 0; let vid = 0;
type V = { size?: string; color?: string };
type S = { name: string; slug: string; price: number; specification?: string; shortDescription?: string; variants?: V[] };
const bedding = categoryIds.dohars;
const towels = categoryIds.bathTowels;
const weights = ['1.3 kg','1.5 kg','2 kg','2.5 kg','3 kg','4 kg','5 kg','6 kg','7 kg','8 kg'];
const weightedVariants = weights.flatMap((size) => ['Double Bed','Single Bed'].map((color) => ({ size, color })));

function mk(seed: S): Product {
  const id = ++pid;
  // Mock inventory is available so frontend-only catalogue and filter flows are usable.
  const variants: ProductVariant[] = (seed.variants ?? []).map((v) => ({ id: ++vid, productId: id, sku: '', weight: v.size, bedType: v.color as 'Single Bed' | 'Double Bed', stock: 1, isActive: true, createdAt: NOW, updatedAt: NOW }));
  const images: ProductImage[] = [1, 2].map((n) => ({ id: ++iid, productId: id, imageUrl: mockImage(seed.slug, n - 1), cloudId: '', altText: seed.name, sortOrder: n - 1, createdAt: NOW }));
  return { id, categoryId: seed.name.includes('Grade') || seed.name.includes('Towel') ? towels : bedding, name: seed.name, slug: seed.slug, sku: '', shortDescription: seed.shortDescription, description: seed.specification, price: seed.price, stock: 1, featured: false, bestSeller: false, newArrival: false, status: 'published', ratingAvg: 0, ratingCount: 0, metaTitle: seed.name, metaDescription: seed.shortDescription, createdAt: NOW, updatedAt: NOW, images, variants, aggregateRating: 0, reviewCount: 0, specification: seed.specification, sizeLabel: seed.variants ? 'Price per kg; available weights and bed types' : undefined };
}

const seeds: S[] = [
  ['Dohar Double Bed','dohar-double-bed',699,'Size: 90x100 inches. Price: Rs 699 + GST.'],
  ['Fleno Woolen Set with Satin','fleno-woolen-set-with-satin',699,'Includes: 1 Double Bedsheet; 2 Pillow Covers.'],
  ['6 Piece Embroidery set','6-piece-embroidery-set',1999,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Cushions; 2 Pillow Covers.'],
  ['5 Piece Lace set','5-piece-lace-set',699,'Includes: 1 Double Bedsheet; 2 Cushions; 2 Pillow Covers.'],
  ['Snowberry 4 Piece set','snowberry-4-piece-set',1349,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['6 Piece Comforter Set','6-piece-comforter-set',1399,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Cushions; 2 Pillow Covers.'],
  ['La Mour 4 Piece set','la-mour-4-piece-set',1299,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['White Pearls 4 Piece set','white-pearls-4-piece-set',1299,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Plash 4 Piece set','plash-4-piece-set',1299,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Occasion Dohar Double Bed Set','occasion-dohar-double-bed-set',1399,'Includes: 1 AC Dohar Double bed; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Dior Comforter Double bed','dior-comforter-double-bed',549], ['Plano Woolen Set','plano-woolen-set',499,'Includes: 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Celebration 4 Piece Set','celebration-4-piece-set',799,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'], ['Calvin Print 4 Piece Set','calvin-print-4-piece-set',999,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'], ['Calvin Solid 4 Piece Set','calvin-solid-4-piece-set',1199,'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'], ['Pum-Pum 5 Piece Set','pum-pum-5-piece-set',499,'Includes: 1 Double Bedsheet; 2 Cushions; 2 Pillow Covers.'],
  ['Gulliver Super Soft','gulliver-super-soft',270,undefined,'Rs 270/KG + GST + BAG EXTRA',weightedVariants], ['Mink Blanket','mink-blanket',230,undefined,'Rs 230/KG + GST + BAG EXTRA',weightedVariants], ['Mink Cloudy','mink-cloudy',300,undefined,'Rs 300/KG + GST + BAG EXTRA',weightedVariants],
  ['A Grade Towels','a-grade-towels',455,"Rs 455/kg. GST included. Sizes: Men's bath towel 27 x 54 to 30 x 60 inches; Women's bath towel 24 x 48 inches approximately; Beach towel 36 x 72 inches; Hand towel 16 x 24 inches; Face towel 12 x 12 inches."],
  ['A Grade Bath Towel 500 gm','a-grade-bath-towel-500-gm',230,undefined,'500 gm. Rs 230/pc. GST included.'], ['A Grade Bath Towel 650 gm','a-grade-bath-towel-650-gm',300,undefined,'650 gm. Rs 300/pc. GST included.'], ["A Grade Women's / Baby Towel",'a-grade-womens-baby-towel',150,undefined,'24 x 48 inches approximately; average weight 330 gm. Rs 150/pc. GST included.'], ['A Grade Hand Towel','a-grade-hand-towel',78,undefined,'170 gm. Rs 78/pc. GST included.'], ['A Grade Face Towel','a-grade-face-towel',23,undefined,'50 gm. Rs 23/pc. GST included.'], ['A Grade Beach Towel','a-grade-beach-towel',360,undefined,'800 gm. Rs 360/pc. GST included.'],
  ['B+ Grade Towels','b-plus-grade-towels',335,"Rs 335/kg. GST included. Sizes: Men's bath towel 27 x 54 to 30 x 60 inches; Women's bath towel 24 x 48 inches approximately; Beach towel 36 x 72 inches; Hand towel 16 x 24 inches; Face towel 12 x 12 inches."],
  ['B+ Grade Bath Towel 500 gm','b-plus-grade-bath-towel-500-gm',168,undefined,'500 gm. Rs 168/pc. GST included.'], ['B+ Grade Bath Towel 650 gm','b-plus-grade-bath-towel-650-gm',218,undefined,'650 gm. Rs 218/pc. GST included.'], ["B+ Grade Women's / Baby Towel",'b-plus-grade-womens-baby-towel',117,undefined,'24 x 48 inches approximately; average weight 330 gm. Rs 117/pc. GST included.'], ['B+ Grade Hand Towel','b-plus-grade-hand-towel',57,undefined,'170 gm. Rs 57/pc. GST included.'], ['B+ Grade Face Towel','b-plus-grade-face-towel',17,undefined,'50 gm. Rs 17/pc. GST included.'], ['B+ Grade Beach Towel','b-plus-grade-beach-towel',268,undefined,'800 gm. Rs 268/pc. GST included.'],
].map((x) => ({ name:x[0] as string, slug:x[1] as string, price:x[2] as number, specification:x[3] as string|undefined, shortDescription:x[4] as string|undefined, variants:x[5] as V[]|undefined }));

export const products: Product[] = seeds.map(mk);
export const productBySlug = new Map(products.map((p) => [p.slug, p]));
export default products;
