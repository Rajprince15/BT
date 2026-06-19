import type { Product } from '@/types/Product';
import type { ProductImage } from '@/types/ProductImage';
import type { ProductVariant } from '@/types/ProductVariant';
import { categoryIds } from '@/mocks/categories.mock';

const NOW = '2025-12-15T10:00:00.000Z';
const IMG = (slug: string, idx: number) =>
  `https://res.cloudinary.com/demo/image/upload/c_fill,w_900,h_900,q_auto,f_auto/v1/bhavita/products/${slug}-${idx}.jpg`;

// ---- helpers (mock-only — never leak outside this file) ----
let _pid = 0;
let _imgId = 0;
let _varId = 0;

interface Seed {
  categoryId: number;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  weightGrams?: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  ratingAvg?: number;
  ratingCount?: number;
  imageCount?: number; // 2–4
  variants: Array<{ size?: string; color?: string; stock: number; priceDelta?: number }>;
}

function mk(seed: Seed): Product {
  const id = ++_pid;
  const imageCount = Math.max(2, Math.min(4, seed.imageCount ?? 3));
  const images: ProductImage[] = Array.from({ length: imageCount }, (_, i) => ({
    id: ++_imgId,
    productId: id,
    imageUrl: IMG(seed.slug, i + 1),
    cloudId: `bhavita/products/${seed.slug}-${i + 1}`,
    altText: `${seed.name} — view ${i + 1}`,
    sortOrder: i,
    createdAt: NOW,
  }));
  const variants: ProductVariant[] = seed.variants.map((v) => ({
    id: ++_varId,
    productId: id,
    sku: `${seed.sku}-${(v.size ?? 'OS').replace(/\s+/g, '')}-${(v.color ?? 'NA').replace(/\s+/g, '')}`,
    size: v.size,
    color: v.color,
    price: v.priceDelta ? seed.price + v.priceDelta : undefined,
    stock: v.stock,
    isActive: v.stock > 0,
    createdAt: NOW,
    updatedAt: NOW,
  }));
  const ratingAvg = seed.ratingAvg ?? 4.4;
  const ratingCount = seed.ratingCount ?? 18;
  return {
    id,
    categoryId: seed.categoryId,
    name: seed.name,
    slug: seed.slug,
    sku: seed.sku,
    shortDescription: seed.shortDescription,
    description: seed.description,
    price: seed.price,
    salePrice: seed.salePrice,
    stock: seed.stock,
    weightGrams: seed.weightGrams,
    featured: !!seed.featured,
    bestSeller: !!seed.bestSeller,
    newArrival: !!seed.newArrival,
    status: 'published',
    ratingAvg,
    ratingCount,
    metaTitle: `${seed.name} | Bhavita Textiles`,
    metaDescription: seed.shortDescription,
    createdAt: NOW,
    updatedAt: NOW,
    images,
    variants,
    aggregateRating: ratingAvg,
    reviewCount: ratingCount,
  };
}

const seeds: Seed[] = [
  // ---- BEDROOM / Cotton Bedsheets (3)
  { categoryId: categoryIds.cottonBedsheets, name: 'Ivory Pure Cotton King Bedsheet', slug: 'ivory-cotton-king-bedsheet', sku: 'BT-CB-001', shortDescription: '300 TC mercerised cotton, ivory with gold piping.', description: 'Woven from 100% long-staple cotton, this 300 TC king-size bedsheet features hand-finished gold piping along the edges. Includes 2 pillow covers.', price: 4499, salePrice: 3299, stock: 80, weightGrams: 1600, featured: true, bestSeller: true, ratingAvg: 4.7, ratingCount: 32, variants: [{ size: 'King', color: 'Ivory', stock: 40 }, { size: 'Queen', color: 'Ivory', stock: 40, priceDelta: -500 }] },
  { categoryId: categoryIds.cottonBedsheets, name: 'Royal Indigo Sateen Bedsheet', slug: 'royal-indigo-sateen-bedsheet', sku: 'BT-CB-002', shortDescription: 'Sateen weave, deep indigo, hotel-grade finish.', description: 'Smooth sateen weave with a soft sheen. 400 TC, hypoallergenic. Includes 2 pillow covers.', price: 5299, stock: 60, weightGrams: 1700, newArrival: true, ratingAvg: 4.5, ratingCount: 14, variants: [{ size: 'King', color: 'Indigo', stock: 30 }, { size: 'Queen', color: 'Indigo', stock: 30 }] },
  { categoryId: categoryIds.cottonBedsheets, name: 'Classic Stripe Cotton Bedsheet', slug: 'classic-stripe-cotton-bedsheet', sku: 'BT-CB-003', shortDescription: 'Heritage stripes, charcoal & ivory.', description: 'Heritage stripe pattern in charcoal & ivory, 200 TC, mid-weight cotton.', price: 2899, salePrice: 2199, stock: 120, ratingAvg: 4.3, ratingCount: 41, variants: [{ size: 'Single', color: 'Charcoal', stock: 40 }, { size: 'Double', color: 'Charcoal', stock: 40 }, { size: 'King', color: 'Charcoal', stock: 40 }] },

  // ---- Handloom Bedsheets (2)
  { categoryId: categoryIds.handloomBedsheets, name: 'Maheshwari Handloom Bedsheet', slug: 'maheshwari-handloom-bedsheet', sku: 'BT-HB-001', shortDescription: 'Handloom-woven, traditional Maheshwari border.', description: 'Hand-woven by master weavers from Maheshwar. Pure cotton, gold zari border.', price: 6799, stock: 24, featured: true, ratingAvg: 4.8, ratingCount: 22, variants: [{ size: 'Queen', color: 'Saffron', stock: 12 }, { size: 'King', color: 'Saffron', stock: 12 }] },
  { categoryId: categoryIds.handloomBedsheets, name: 'Khadi Handloom Bedsheet', slug: 'khadi-handloom-bedsheet', sku: 'BT-HB-002', shortDescription: 'Pure khadi, breathable summer weave.', description: 'Pure khadi cotton, breathable and soft. Naturally dyed.', price: 4299, salePrice: 3499, stock: 36, ratingAvg: 4.6, ratingCount: 19, variants: [{ size: 'Double', color: 'Natural', stock: 18 }, { size: 'King', color: 'Natural', stock: 18 }] },

  // ---- Premium Bedsheets (1)
  { categoryId: categoryIds.premiumBedsheets, name: 'Imperial Gold Jacquard Bedsheet Set', slug: 'imperial-gold-jacquard-bedsheet', sku: 'BT-PB-001', shortDescription: '600 TC jacquard, royal gold motif.', description: '600 TC Egyptian-cotton jacquard with royal gold floral motif. Includes 2 pillow covers.', price: 12999, salePrice: 9499, stock: 18, featured: true, bestSeller: true, ratingAvg: 4.9, ratingCount: 27, variants: [{ size: 'King', color: 'Gold', stock: 18 }] },

  // ---- Winter Blankets / Quilts / Dohars (3)
  { categoryId: categoryIds.winterBlankets, name: 'Cashmere-Wool Royal Blanket', slug: 'cashmere-wool-royal-blanket', sku: 'BT-WB-001', shortDescription: 'Cashmere-wool blend, double bed.', description: 'Luxuriously warm cashmere-wool blend blanket. Double size.', price: 9299, salePrice: 6999, stock: 22, featured: true, ratingAvg: 4.7, ratingCount: 16, variants: [{ size: 'Double', color: 'Charcoal', stock: 11 }, { size: 'King', color: 'Charcoal', stock: 11, priceDelta: 1500 }] },
  { categoryId: categoryIds.quilts, name: 'Jaipuri Razai Hand-Quilted Quilt', slug: 'jaipuri-razai-quilt', sku: 'BT-QL-001', shortDescription: 'Hand-quilted Jaipuri razai, cotton-filled.', description: 'Traditional Jaipuri razai with cotton filling and hand-block-printed cover.', price: 4599, stock: 30, newArrival: true, ratingAvg: 4.5, ratingCount: 12, variants: [{ size: 'Single', color: 'Crimson', stock: 15 }, { size: 'Double', color: 'Crimson', stock: 15 }] },
  { categoryId: categoryIds.dohars, name: 'Reversible Mulmul Dohar', slug: 'reversible-mulmul-dohar', sku: 'BT-DH-001', shortDescription: 'Triple-layer mulmul, reversible, AC-friendly.', description: '3-layer mulmul dohar, reversible, perfect for Indian summers.', price: 2799, salePrice: 1999, stock: 80, bestSeller: true, ratingAvg: 4.6, ratingCount: 54, variants: [{ size: 'Single', color: 'Sky', stock: 40 }, { size: 'Double', color: 'Sky', stock: 40 }] },

  // ---- Cushion Covers / Bed Runners (2)
  { categoryId: categoryIds.cushionCovers, name: 'Velvet Royal Cushion Cover (Set of 2)', slug: 'velvet-royal-cushion-cover-set', sku: 'BT-CC-001', shortDescription: 'Velvet, gold piping, 16×16 in.', description: 'Plush velvet cushion covers with hand-stitched gold piping. Set of 2.', price: 1499, salePrice: 999, stock: 200, bestSeller: true, ratingAvg: 4.4, ratingCount: 88, variants: [{ size: '16x16', color: 'Emerald', stock: 80 }, { size: '16x16', color: 'Burgundy', stock: 60 }, { size: '20x20', color: 'Emerald', stock: 60, priceDelta: 200 }] },
  { categoryId: categoryIds.bedRunners, name: 'Brocade Bed Runner', slug: 'brocade-bed-runner', sku: 'BT-BR-001', shortDescription: 'Brocade silk bed runner, gold thread work.', description: 'Hand-finished brocade bed runner with intricate gold thread work.', price: 2999, stock: 40, newArrival: true, ratingAvg: 4.5, ratingCount: 9, variants: [{ size: 'Queen', color: 'Maroon', stock: 20 }, { size: 'King', color: 'Maroon', stock: 20 }] },

  // ---- LIVING ROOM / Sofa Throws / Curtains (4)
  { categoryId: categoryIds.sofaThrows, name: 'Handwoven Cotton Sofa Throw', slug: 'handwoven-cotton-sofa-throw', sku: 'BT-ST-001', shortDescription: 'Handwoven, fringed edges, 50×60 in.', description: 'Soft handwoven cotton throw with fringed edges. Layer over any sofa.', price: 2199, salePrice: 1699, stock: 60, ratingAvg: 4.5, ratingCount: 24, variants: [{ size: '50x60', color: 'Mustard', stock: 30 }, { size: '50x60', color: 'Indigo', stock: 30 }] },
  { categoryId: categoryIds.luxuryCurtains, name: 'Silk Damask Luxury Curtain (Pair)', slug: 'silk-damask-luxury-curtain', sku: 'BT-LC-001', shortDescription: 'Silk damask, gold-on-ivory, 7 ft.', description: 'Silk damask curtain pair, gold-on-ivory pattern. 7 ft drop.', price: 8499, salePrice: 6499, stock: 28, featured: true, ratingAvg: 4.7, ratingCount: 13, variants: [{ size: '7ft', color: 'Ivory-Gold', stock: 14 }, { size: '9ft', color: 'Ivory-Gold', stock: 14, priceDelta: 1200 }] },
  { categoryId: categoryIds.blackoutCurtains, name: 'Premium Blackout Curtain (Pair)', slug: 'premium-blackout-curtain', sku: 'BT-BC-001', shortDescription: 'Triple-weave blackout, thermal insulation.', description: 'Triple-weave blackout curtain with thermal insulation. Sold as a pair.', price: 4299, stock: 50, bestSeller: true, ratingAvg: 4.6, ratingCount: 71, variants: [{ size: '7ft', color: 'Navy', stock: 25 }, { size: '9ft', color: 'Navy', stock: 25, priceDelta: 600 }] },
  { categoryId: categoryIds.luxuryCurtains, name: 'Velvet Royal Drape Curtain', slug: 'velvet-royal-drape-curtain', sku: 'BT-LC-002', shortDescription: 'Heavy velvet drape, theatre-grade.', description: 'Heavy velvet drape curtain, theatre-grade weight and finish.', price: 9899, salePrice: 7499, stock: 16, newArrival: true, ratingAvg: 4.8, ratingCount: 6, variants: [{ size: '9ft', color: 'Emerald', stock: 8 }, { size: '9ft', color: 'Burgundy', stock: 8 }] },

  // ---- Rugs / Door Mats (4)
  { categoryId: categoryIds.handwovenRugs, name: 'Dhurrie Handwoven Cotton Rug', slug: 'dhurrie-handwoven-cotton-rug', sku: 'BT-RG-001', shortDescription: 'Flat-weave dhurrie, geometric motif.', description: 'Flat-weave dhurrie rug, geometric motif, woven by Rajasthani artisans.', price: 6799, salePrice: 4999, stock: 22, featured: true, ratingAvg: 4.6, ratingCount: 18, variants: [{ size: '4x6', color: 'Saffron', stock: 11 }, { size: '6x9', color: 'Saffron', stock: 11, priceDelta: 2200 }] },
  { categoryId: categoryIds.areaRugs, name: 'Persian-Inspired Area Rug', slug: 'persian-inspired-area-rug', sku: 'BT-AR-001', shortDescription: 'Plush pile, Persian motif.', description: 'Plush pile area rug with Persian-inspired motif. Hand-tufted.', price: 14999, salePrice: 11499, stock: 12, bestSeller: true, ratingAvg: 4.8, ratingCount: 21, variants: [{ size: '5x7', color: 'Ruby', stock: 6 }, { size: '8x10', color: 'Ruby', stock: 6, priceDelta: 4500 }] },
  { categoryId: categoryIds.cottonMats, name: 'Handloom Cotton Door Mat', slug: 'handloom-cotton-door-mat', sku: 'BT-DM-001', shortDescription: 'Handloom cotton, anti-skid backing.', description: 'Hand-woven cotton door mat with anti-skid latex backing.', price: 899, salePrice: 649, stock: 200, bestSeller: true, ratingAvg: 4.4, ratingCount: 132, variants: [{ size: '16x24', color: 'Charcoal', stock: 100 }, { size: '20x30', color: 'Charcoal', stock: 100, priceDelta: 200 }] },
  { categoryId: categoryIds.cottonMats, name: 'Block-Printed Door Mat', slug: 'block-printed-door-mat', sku: 'BT-DM-002', shortDescription: 'Hand-block-printed cotton mat.', description: 'Hand-block-printed cotton door mat in traditional Jaipuri motif.', price: 1099, stock: 110, newArrival: true, ratingAvg: 4.3, ratingCount: 29, variants: [{ size: '18x28', color: 'Indigo', stock: 55 }, { size: '18x28', color: 'Saffron', stock: 55 }] },

  // ---- BATH (3)
  { categoryId: categoryIds.bathTowels, name: 'Egyptian Cotton Bath Towel', slug: 'egyptian-cotton-bath-towel', sku: 'BT-BT-001', shortDescription: '600 GSM, ultra-absorbent.', description: '600 GSM Egyptian cotton bath towel, ultra-absorbent and soft.', price: 1499, salePrice: 1099, stock: 250, bestSeller: true, ratingAvg: 4.7, ratingCount: 188, variants: [{ size: 'Standard', color: 'Ivory', stock: 80 }, { size: 'Standard', color: 'Charcoal', stock: 80 }, { size: 'Bath Sheet', color: 'Ivory', stock: 90, priceDelta: 600 }] },
  { categoryId: categoryIds.luxuryTowels, name: 'Royal Hotel Collection Bath Towel', slug: 'royal-hotel-bath-towel', sku: 'BT-LT-001', shortDescription: '700 GSM zero-twist, hotel grade.', description: '700 GSM zero-twist Egyptian cotton, used by 5-star hotels.', price: 1999, stock: 140, featured: true, ratingAvg: 4.8, ratingCount: 64, variants: [{ size: 'Standard', color: 'Pearl', stock: 70 }, { size: 'Bath Sheet', color: 'Pearl', stock: 70, priceDelta: 800 }] },
  { categoryId: categoryIds.bathMats, name: 'Plush Pile Cotton Bath Mat', slug: 'plush-pile-cotton-bath-mat', sku: 'BT-BM-001', shortDescription: 'Plush pile cotton, anti-skid.', description: 'Plush pile cotton bath mat with anti-skid backing. Quick-drying.', price: 1199, salePrice: 849, stock: 180, ratingAvg: 4.5, ratingCount: 92, variants: [{ size: '20x32', color: 'Sand', stock: 90 }, { size: '20x32', color: 'Sage', stock: 90 }] },

  // ---- HOME DECOR (4)
  { categoryId: categoryIds.tableLinen, name: 'Hand-Embroidered Table Runner', slug: 'hand-embroidered-table-runner', sku: 'BT-TL-001', shortDescription: 'Linen table runner, gold thread embroidery.', description: 'Pure linen table runner with hand-embroidered gold thread work.', price: 2299, stock: 60, newArrival: true, ratingAvg: 4.6, ratingCount: 11, variants: [{ size: '72in', color: 'Ivory', stock: 30 }, { size: '108in', color: 'Ivory', stock: 30, priceDelta: 700 }] },
  { categoryId: categoryIds.tableLinen, name: 'Block-Printed Cotton Tablecloth', slug: 'block-printed-cotton-tablecloth', sku: 'BT-TL-002', shortDescription: 'Hand-block-printed cotton tablecloth.', description: 'Hand-block-printed cotton tablecloth, fits 6-seater dining tables.', price: 1899, salePrice: 1399, stock: 80, ratingAvg: 4.4, ratingCount: 38, variants: [{ size: '6-seater', color: 'Indigo', stock: 40 }, { size: '8-seater', color: 'Indigo', stock: 40, priceDelta: 500 }] },
  { categoryId: categoryIds.wallDecor, name: 'Handwoven Wall Tapestry', slug: 'handwoven-wall-tapestry', sku: 'BT-WD-001', shortDescription: 'Handwoven wool wall tapestry.', description: 'Hand-woven wool wall tapestry with traditional tribal motifs.', price: 5999, salePrice: 4499, stock: 18, featured: true, ratingAvg: 4.7, ratingCount: 8, variants: [{ size: '3x4', color: 'Earth', stock: 9 }, { size: '4x6', color: 'Earth', stock: 9, priceDelta: 1800 }] },
  { categoryId: categoryIds.festiveDecor, name: 'Festive Toran Door Hanging', slug: 'festive-toran-door-hanging', sku: 'BT-FD-001', shortDescription: 'Handcrafted festive toran with bells.', description: 'Handcrafted festive toran with brass bells and mirror work.', price: 1299, stock: 120, newArrival: true, ratingAvg: 4.5, ratingCount: 47, variants: [{ size: '36in', color: 'Multicolour', stock: 120 }] },

  // ---- HANDLOOM HERITAGE (4)
  { categoryId: categoryIds.jaipurPrints, name: 'Jaipur Sanganeri Print Cushion Cover Set', slug: 'jaipur-sanganeri-cushion-cover-set', sku: 'BT-JP-001', shortDescription: 'Sanganeri block print, set of 4.', description: 'Authentic Sanganeri hand-block-printed cushion covers. Set of 4.', price: 1899, salePrice: 1399, stock: 90, bestSeller: true, ratingAvg: 4.6, ratingCount: 73, variants: [{ size: '16x16', color: 'Indigo', stock: 45 }, { size: '16x16', color: 'Saffron', stock: 45 }] },
  { categoryId: categoryIds.blockPrint, name: 'Bagru Block-Print Bed Cover', slug: 'bagru-block-print-bed-cover', sku: 'BT-BP-001', shortDescription: 'Bagru hand block print, natural dye.', description: 'Hand-block-printed bed cover from Bagru, natural vegetable dyes.', price: 3599, stock: 36, featured: true, ratingAvg: 4.7, ratingCount: 19, variants: [{ size: 'Double', color: 'Indigo', stock: 18 }, { size: 'King', color: 'Indigo', stock: 18, priceDelta: 900 }] },
  { categoryId: categoryIds.artisan, name: 'Artisan Kantha Throw', slug: 'artisan-kantha-throw', sku: 'BT-AR-002', shortDescription: 'Hand-stitched kantha throw.', description: 'Hand-stitched Bengali kantha throw, multi-layered cotton.', price: 4799, salePrice: 3499, stock: 26, ratingAvg: 4.7, ratingCount: 14, variants: [{ size: 'Single', color: 'Mixed', stock: 13 }, { size: 'Double', color: 'Mixed', stock: 13, priceDelta: 1100 }] },
  { categoryId: categoryIds.jaipurPrints, name: 'Sanganeri Floral Tablecloth', slug: 'sanganeri-floral-tablecloth', sku: 'BT-JP-002', shortDescription: 'Sanganeri floral block print.', description: 'Sanganeri floral block-printed cotton tablecloth, vegetable dyes.', price: 1799, stock: 70, newArrival: true, ratingAvg: 4.4, ratingCount: 22, variants: [{ size: '6-seater', color: 'Rose', stock: 35 }, { size: '8-seater', color: 'Rose', stock: 35, priceDelta: 500 }] },

  // ---- HANDICRAFTS (3)
  { categoryId: categoryIds.giftCollection, name: 'Festive Gift Hamper — Premium', slug: 'festive-gift-hamper-premium', sku: 'BT-GC-001', shortDescription: 'Curated gift hamper for festive season.', description: 'Premium festive gift hamper including a runner, 2 cushion covers, and a toran.', price: 4999, salePrice: 3799, stock: 50, featured: true, bestSeller: true, ratingAvg: 4.8, ratingCount: 36, variants: [{ size: 'Standard', color: 'Festive', stock: 50 }] },
  { categoryId: categoryIds.decorativeItems, name: 'Brass-Inlay Decorative Cushion', slug: 'brass-inlay-decorative-cushion', sku: 'BT-DI-001', shortDescription: 'Cushion with hand-set brass inlay.', description: 'Decorative cushion with hand-set brass mirror inlay and embroidery.', price: 2199, stock: 44, ratingAvg: 4.5, ratingCount: 17, variants: [{ size: '16x16', color: 'Ochre', stock: 22 }, { size: '20x20', color: 'Ochre', stock: 22, priceDelta: 300 }] },
  { categoryId: categoryIds.giftCollection, name: 'Wedding Trousseau Gift Set', slug: 'wedding-trousseau-gift-set', sku: 'BT-GC-002', shortDescription: 'Wedding trousseau set with bed linen.', description: 'Premium wedding trousseau set: King bedsheet + 2 pillow covers + 2 cushion covers.', price: 9999, salePrice: 7499, stock: 24, featured: true, newArrival: true, ratingAvg: 4.9, ratingCount: 12, variants: [{ size: 'King', color: 'Crimson-Gold', stock: 12 }, { size: 'Queen', color: 'Crimson-Gold', stock: 12, priceDelta: -800 }] },

  // ---- Special Collections placeholders covered by flags above
  // ---- A few more to reach 40+ with category coverage
  { categoryId: categoryIds.cottonBedsheets, name: 'Heritage Floral Cotton Bedsheet', slug: 'heritage-floral-cotton-bedsheet', sku: 'BT-CB-004', shortDescription: 'Floral cotton, 220 TC, queen.', description: 'Vintage floral print on 220 TC pure cotton. Queen size.', price: 2499, stock: 90, ratingAvg: 4.3, ratingCount: 33, variants: [{ size: 'Queen', color: 'Rose', stock: 45 }, { size: 'Queen', color: 'Sage', stock: 45 }] },
  { categoryId: categoryIds.handwovenRugs, name: 'Tribal Motif Handwoven Rug', slug: 'tribal-motif-handwoven-rug', sku: 'BT-RG-002', shortDescription: 'Tribal motif, handwoven wool.', description: 'Handwoven wool rug with traditional tribal motifs.', price: 8999, salePrice: 6799, stock: 14, ratingAvg: 4.6, ratingCount: 11, variants: [{ size: '4x6', color: 'Sand', stock: 7 }, { size: '6x9', color: 'Sand', stock: 7, priceDelta: 2400 }] },
  { categoryId: categoryIds.bathTowels, name: 'Bamboo-Cotton Bath Towel Set', slug: 'bamboo-cotton-bath-towel-set', sku: 'BT-BT-002', shortDescription: 'Bamboo-cotton blend, set of 2.', description: 'Bamboo-cotton blend towel set (2 bath + 2 hand). Antimicrobial.', price: 2299, salePrice: 1699, stock: 110, newArrival: true, ratingAvg: 4.5, ratingCount: 47, variants: [{ size: 'Set of 4', color: 'Sage', stock: 55 }, { size: 'Set of 4', color: 'Charcoal', stock: 55 }] },
  { categoryId: categoryIds.wallDecor, name: 'Macrame Wall Hanging', slug: 'macrame-wall-hanging', sku: 'BT-WD-002', shortDescription: 'Handknotted macrame wall hanging.', description: 'Hand-knotted cotton macrame wall hanging with bohemian fringe.', price: 1899, stock: 70, ratingAvg: 4.4, ratingCount: 28, variants: [{ size: '24in', color: 'Natural', stock: 35 }, { size: '36in', color: 'Natural', stock: 35, priceDelta: 600 }] },
  { categoryId: categoryIds.cushionCovers, name: 'Phulkari Embroidered Cushion Cover', slug: 'phulkari-cushion-cover', sku: 'BT-CC-002', shortDescription: 'Phulkari embroidery, single piece.', description: 'Authentic Phulkari hand-embroidered cushion cover.', price: 999, salePrice: 749, stock: 150, ratingAvg: 4.5, ratingCount: 62, variants: [{ size: '16x16', color: 'Magenta', stock: 75 }, { size: '16x16', color: 'Mustard', stock: 75 }] },
  { categoryId: categoryIds.sofaThrows, name: 'Velvet Tasseled Sofa Throw', slug: 'velvet-tasseled-sofa-throw', sku: 'BT-ST-002', shortDescription: 'Velvet throw with hand-tied tassels.', description: 'Plush velvet throw with hand-tied tassels along all four edges.', price: 3299, salePrice: 2499, stock: 40, ratingAvg: 4.6, ratingCount: 14, variants: [{ size: '50x60', color: 'Burgundy', stock: 20 }, { size: '50x60', color: 'Emerald', stock: 20 }] },
  { categoryId: categoryIds.luxuryTowels, name: 'Spa Collection Towel Set', slug: 'spa-collection-towel-set', sku: 'BT-LT-002', shortDescription: 'Spa-grade towel set of 6.', description: 'Spa-grade Egyptian cotton towel set of 6 (2 bath, 2 hand, 2 face).', price: 4999, stock: 65, bestSeller: true, ratingAvg: 4.7, ratingCount: 53, variants: [{ size: 'Set of 6', color: 'Pearl', stock: 32 }, { size: 'Set of 6', color: 'Cocoa', stock: 33 }] },
];

export const products: Product[] = seeds.map(mk);
