import type { Review } from '@/types/Review';

const D = (offset: number) => {
  const d = new Date('2025-12-15T10:00:00.000Z');
  d.setDate(d.getDate() - offset);
  return d.toISOString();
};

interface RSeed {
  productId: number;
  rating: number;
  title: string;
  review: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: number;
  daysAgo: number;
  orderId?: number;
}

const seeds: RSeed[] = [
  // Approved (majority) — spanning multiple products
  { productId: 1, userId: 1, rating: 5, title: 'Beautiful drape', review: 'The ivory bedsheet looks luxurious and the cotton feels premium.', status: 'approved', daysAgo: 12, orderId: 3 },
  { productId: 1, userId: 2, rating: 4, title: 'Soft & well-finished', review: 'Excellent quality, slight shrinkage after first wash.', status: 'approved', daysAgo: 30 },
  { productId: 6, userId: 1, rating: 5, title: 'Truly imperial', review: 'The 600 TC jacquard sheet is unreal. Worth every rupee.', status: 'approved', daysAgo: 18 },
  { productId: 7, userId: 1, rating: 5, title: 'Warm & elegant', review: 'Cashmere blend is incredibly warm. Perfect for Delhi winters.', status: 'approved', daysAgo: 35 },
  { productId: 9, userId: 1, rating: 4, title: 'Gorgeous gold piping', review: 'Velvet feels rich. The gold piping really stands out.', status: 'approved', daysAgo: 9, orderId: 5 },
  { productId: 9, userId: 2, rating: 5, title: 'My favourite cushion', review: 'Beautiful colour and stitching. Highly recommend.', status: 'approved', daysAgo: 45 },
  { productId: 12, userId: 1, rating: 5, title: 'Stunning curtains', review: 'They transformed our living room.', status: 'approved', daysAgo: 22 },
  { productId: 13, userId: 3, rating: 4, title: 'Effective blackout', review: 'Excellent blackout effect, slightly stiff fabric.', status: 'approved', daysAgo: 14 },
  { productId: 14, userId: 1, rating: 5, title: 'Worth the price', review: 'Plush pile and intricate motif. Gorgeous.', status: 'approved', daysAgo: 50 },
  { productId: 15, userId: 2, rating: 4, title: 'Great value mat', review: 'Sturdy and well-finished for the price.', status: 'approved', daysAgo: 7 },
  { productId: 18, userId: 1, rating: 5, title: '5-star hotel feel', review: 'Towels are thick and absorbent.', status: 'approved', daysAgo: 11, orderId: 3 },
  { productId: 19, userId: 3, rating: 5, title: 'Best towels ever', review: 'Zero-twist makes a real difference. Soft and quick-dry.', status: 'approved', daysAgo: 28 },
  { productId: 22, userId: 1, rating: 4, title: 'Beautiful runner', review: 'Embroidery is exquisite. A bit delicate so handle carefully.', status: 'approved', daysAgo: 16 },
  { productId: 24, userId: 2, rating: 5, title: 'Statement piece', review: 'The wall tapestry brought the whole room together.', status: 'approved', daysAgo: 33 },
  { productId: 26, userId: 1, rating: 5, title: 'Perfect gift', review: 'Hamper arrived beautifully packed. Recipient loved it.', status: 'approved', daysAgo: 8, orderId: 5 },
  { productId: 27, userId: 3, rating: 5, title: 'Trousseau worthy', review: 'Crimson + gold combo is regal. Excellent stitching.', status: 'approved', daysAgo: 19 },

  // Pending (newer reviews waiting for moderation)
  { productId: 3, userId: 1, rating: 4, title: 'Lovely stripes', review: 'Pattern is elegant and fits king beds well.', status: 'pending', daysAgo: 1 },
  { productId: 8, userId: 1, rating: 5, title: 'Cosy razai', review: 'Hand-printed cover is a delight to look at.', status: 'pending', daysAgo: 2 },

  // Rejected (e.g. spam / off-topic)
  { productId: 5, userId: 1, rating: 1, title: 'Test review', review: 'asdf asdf', status: 'rejected', daysAgo: 5 },
  { productId: 11, userId: 2, rating: 5, title: 'spammy review', review: 'visit my site .com promo', status: 'rejected', daysAgo: 21 },
];

let _id = 0;
export const reviews: Review[] = seeds.map((s) => ({
  id: ++_id,
  userId: s.userId,
  productId: s.productId,
  orderId: s.orderId,
  rating: s.rating,
  title: s.title,
  review: s.review,
  status: s.status,
  createdAt: D(s.daysAgo),
  updatedAt: D(Math.max(0, s.daysAgo - 1)),
}));
