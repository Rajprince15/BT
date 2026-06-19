import type { Category } from '@/types/Category';

const now = '2025-11-01T10:00:00.000Z';

// Helper to keep the seed terse.
let _id = 0;
const mk = (
  name: string,
  slug: string,
  parentId: number | undefined,
  imageUrl?: string,
  sortOrder = 0
): Category => ({
  id: ++_id,
  parentId,
  name,
  slug,
  description: `${name} collection — handcrafted, premium textiles.`,
  imageUrl: imageUrl ?? `https://res.cloudinary.com/demo/image/upload/v1/bhavita/categories/${slug}.jpg`,
  sortOrder,
  isActive: true,
  createdAt: now,
  updatedAt: now,
});

// ---- TOP-LEVEL ----
const bedroom = mk('Bedroom Collection', 'bedroom', undefined, undefined, 1);
const livingRoom = mk('Living Room Collection', 'living-room', undefined, undefined, 2);
const bath = mk('Bath Collection', 'bath', undefined, undefined, 3);
const homeDecor = mk('Home Decor', 'home-decor', undefined, undefined, 4);
const handloom = mk('Handloom Heritage', 'handloom-heritage', undefined, undefined, 5);
const handicrafts = mk('Handicrafts Collection', 'handicrafts', undefined, undefined, 6);
const special = mk('Special Collections', 'special-collections', undefined, undefined, 7);

// ---- BEDROOM children ----
const bedsheets = mk('Bedsheets', 'bedsheets', bedroom.id, undefined, 1);
const blankets = mk('Blankets & Comforters', 'blankets-comforters', bedroom.id, undefined, 2);
const pillows = mk('Pillows & Bedding Accessories', 'pillows-bedding', bedroom.id, undefined, 3);

const cottonBedsheets = mk('Cotton Bedsheets', 'cotton-bedsheets', bedsheets.id, undefined, 1);
const handloomBedsheets = mk('Handloom Bedsheets', 'handloom-bedsheets', bedsheets.id, undefined, 2);
const printedBedsheets = mk('Printed Bedsheets', 'printed-bedsheets', bedsheets.id, undefined, 3);
const premiumBedsheets = mk('Premium Collection', 'premium-bedsheets', bedsheets.id, undefined, 4);
const kingBedsheets = mk('King Size', 'king-size-bedsheets', bedsheets.id, undefined, 5);
const queenBedsheets = mk('Queen Size', 'queen-size-bedsheets', bedsheets.id, undefined, 6);
const kidsBedsheets = mk('Kids Collection', 'kids-bedsheets', bedsheets.id, undefined, 7);

const cottonBlankets = mk('Cotton Blankets', 'cotton-blankets', blankets.id);
const winterBlankets = mk('Winter Blankets', 'winter-blankets', blankets.id);
const acBlankets = mk('AC Blankets', 'ac-blankets', blankets.id);
const quilts = mk('Quilts', 'quilts', blankets.id);
const dohars = mk('Dohars', 'dohars', blankets.id);

const pillowCovers = mk('Pillow Covers', 'pillow-covers', pillows.id);
const cushionCovers = mk('Cushion Covers', 'cushion-covers-bedroom', pillows.id);
const bedRunners = mk('Bed Runners', 'bed-runners', pillows.id);

// ---- LIVING ROOM children ----
const softFurnishings = mk('Soft Furnishings', 'soft-furnishings', livingRoom.id);
const curtains = mk('Curtains', 'curtains', livingRoom.id);
const rugs = mk('Rugs & Carpets', 'rugs-carpets', livingRoom.id);
const doorMats = mk('Door Mats', 'door-mats', livingRoom.id);

const sofaThrows = mk('Sofa Throws', 'sofa-throws', softFurnishings.id);
const sofaCovers = mk('Sofa Covers', 'sofa-covers', softFurnishings.id);
const livingCushionCovers = mk('Cushion Covers', 'cushion-covers-living', softFurnishings.id);

const sheerCurtains = mk('Sheer Curtains', 'sheer-curtains', curtains.id);
const blackoutCurtains = mk('Blackout Curtains', 'blackout-curtains', curtains.id);
const cottonCurtains = mk('Cotton Curtains', 'cotton-curtains', curtains.id);
const printedCurtains = mk('Printed Curtains', 'printed-curtains', curtains.id);
const luxuryCurtains = mk('Luxury Curtains', 'luxury-curtains', curtains.id);

const handwovenRugs = mk('Handwoven Rugs', 'handwoven-rugs', rugs.id);
const cottonRugs = mk('Cotton Rugs', 'cotton-rugs', rugs.id);
const floorRugs = mk('Floor Rugs', 'floor-rugs', rugs.id);
const areaRugs = mk('Area Rugs', 'area-rugs', rugs.id);
const carpets = mk('Carpets', 'carpets', rugs.id);
const runnerCarpets = mk('Runner Carpets', 'runner-carpets', rugs.id);

const cottonMats = mk('Cotton Door Mats', 'cotton-door-mats', doorMats.id);
const antiSlipMats = mk('Anti Slip Mats', 'anti-slip-mats', doorMats.id);
const decorativeMats = mk('Decorative Mats', 'decorative-mats', doorMats.id);
const outdoorMats = mk('Outdoor Mats', 'outdoor-mats', doorMats.id);

// ---- BATH children ----
const towels = mk('Towels', 'towels', bath.id);
const bathMats = mk('Bath Mats', 'bath-mats', bath.id);

const bathTowels = mk('Bath Towels', 'bath-towels', towels.id);
const handTowels = mk('Hand Towels', 'hand-towels', towels.id);
const faceTowels = mk('Face Towels', 'face-towels', towels.id);
const luxuryTowels = mk('Luxury Towels', 'luxury-towels', towels.id);
const hotelTowels = mk('Hotel Towels', 'hotel-towels', towels.id);

// ---- HOME DECOR children ----
const wallDecor = mk('Wall Decor', 'wall-decor', homeDecor.id);
const tableLinen = mk('Table Linen', 'table-linen', homeDecor.id);
const decorativeTextiles = mk('Decorative Textiles', 'decorative-textiles', homeDecor.id);
const handmadeDecor = mk('Handmade Decor', 'handmade-decor', homeDecor.id);
const festiveDecor = mk('Festive Decor', 'festive-decor', homeDecor.id);
const cushionStyling = mk('Cushion Styling Collection', 'cushion-styling', homeDecor.id);

// ---- HANDLOOM HERITAGE children ----
const jaipurPrints = mk('Jaipur Prints', 'jaipur-prints', handloom.id);
const blockPrint = mk('Block Print Collection', 'block-print', handloom.id);
const artisan = mk('Artisan Collection', 'artisan-collection', handloom.id);
const ethnicWeaves = mk('Ethnic Weaves', 'ethnic-weaves', handloom.id);
const traditionalHandloom = mk('Traditional Handloom', 'traditional-handloom', handloom.id);

// ---- HANDICRAFTS children ----
const handmadeAccessories = mk('Handmade Home Accessories', 'handmade-accessories', handicrafts.id);
const decorativeItems = mk('Decorative Items', 'decorative-items', handicrafts.id);
const traditionalCraft = mk('Traditional Craft Collection', 'traditional-craft', handicrafts.id);
const giftCollection = mk('Gift Collection', 'gift-collection', handicrafts.id);

// ---- SPECIAL COLLECTIONS children ----
const newArrivals = mk('New Arrivals', 'new-arrivals', special.id);
const bestSellers = mk('Best Sellers', 'best-sellers', special.id);
const summerCollection = mk('Summer Collection', 'summer-collection', special.id);
const winterCollection = mk('Winter Collection', 'winter-collection', special.id);
const festiveCollection = mk('Festive Collection', 'festive-collection', special.id);
const weddingCollection = mk('Wedding Collection', 'wedding-collection', special.id);

export const categories: Category[] = [
  bedroom, livingRoom, bath, homeDecor, handloom, handicrafts, special,
  bedsheets, blankets, pillows,
  cottonBedsheets, handloomBedsheets, printedBedsheets, premiumBedsheets, kingBedsheets, queenBedsheets, kidsBedsheets,
  cottonBlankets, winterBlankets, acBlankets, quilts, dohars,
  pillowCovers, cushionCovers, bedRunners,
  softFurnishings, curtains, rugs, doorMats,
  sofaThrows, sofaCovers, livingCushionCovers,
  sheerCurtains, blackoutCurtains, cottonCurtains, printedCurtains, luxuryCurtains,
  handwovenRugs, cottonRugs, floorRugs, areaRugs, carpets, runnerCarpets,
  cottonMats, antiSlipMats, decorativeMats, outdoorMats,
  towels, bathMats, bathTowels, handTowels, faceTowels, luxuryTowels, hotelTowels,
  wallDecor, tableLinen, decorativeTextiles, handmadeDecor, festiveDecor, cushionStyling,
  jaipurPrints, blockPrint, artisan, ethnicWeaves, traditionalHandloom,
  handmadeAccessories, decorativeItems, traditionalCraft, giftCollection,
  newArrivals, bestSellers, summerCollection, winterCollection, festiveCollection, weddingCollection,
];

export const categoryIds = {
  cottonBedsheets: cottonBedsheets.id,
  handloomBedsheets: handloomBedsheets.id,
  premiumBedsheets: premiumBedsheets.id,
  winterBlankets: winterBlankets.id,
  quilts: quilts.id,
  cushionCovers: cushionCovers.id,
  sofaThrows: sofaThrows.id,
  luxuryCurtains: luxuryCurtains.id,
  blackoutCurtains: blackoutCurtains.id,
  handwovenRugs: handwovenRugs.id,
  areaRugs: areaRugs.id,
  cottonMats: cottonMats.id,
  bathTowels: bathTowels.id,
  luxuryTowels: luxuryTowels.id,
  bathMats: bathMats.id,
  tableLinen: tableLinen.id,
  wallDecor: wallDecor.id,
  festiveDecor: festiveDecor.id,
  jaipurPrints: jaipurPrints.id,
  blockPrint: blockPrint.id,
  artisan: artisan.id,
  giftCollection: giftCollection.id,
  decorativeItems: decorativeItems.id,
  bedRunners: bedRunners.id,
  dohars: dohars.id,
};
