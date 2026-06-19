import type { WholesaleInquiry } from '@/types/WholesaleInquiry';

const D = (offset: number) => {
  const d = new Date('2025-12-15T10:00:00.000Z');
  d.setDate(d.getDate() - offset);
  return d.toISOString();
};

export const wholesaleInquiries: WholesaleInquiry[] = [
  {
    id: 1,
    companyName: 'The Heritage Hotel Group',
    contactPerson: 'Ananya Desai',
    email: 'procurement@heritagehotels.in',
    phone: '+91-9988776655',
    businessType: 'hotel',
    productInterest: 'Bath towels, bed linen',
    quantityRequirement: '500+ units / month',
    message: 'Looking for a long-term supplier for our boutique hotels across Rajasthan.',
    status: 'new',
    createdAt: D(2),
    updatedAt: D(2),
  },
  {
    id: 2,
    companyName: 'Suvarna Interiors LLP',
    contactPerson: 'Rohan Mehra',
    email: 'rohan@suvarnainteriors.com',
    phone: '+91-9876543210',
    businessType: 'interior_designer',
    productInterest: 'Cushion covers, sofa throws, curtains',
    quantityRequirement: '~150 pieces / project',
    message: 'Sourcing for two luxury villa projects in Goa.',
    status: 'contacted',
    notes: 'Sent catalogue + price list on Dec 12.',
    createdAt: D(8),
    updatedAt: D(3),
  },
  {
    id: 3,
    companyName: 'Royal Resorts & Spas',
    contactPerson: 'Kavya Nair',
    email: 'kavya@royalresorts.in',
    phone: '+91-9123456789',
    businessType: 'resort',
    productInterest: 'Luxury bath sets, hotel towels',
    quantityRequirement: '1000+ units / quarter',
    message: 'Need samples before placing a bulk PO.',
    status: 'qualified',
    notes: 'Samples dispatched. Awaiting feedback.',
    createdAt: D(20),
    updatedAt: D(5),
  },
  {
    id: 4,
    companyName: 'Indigo Boutique Store',
    contactPerson: 'Arjun Khanna',
    email: 'arjun@indigoboutique.in',
    phone: '+91-9000011223',
    businessType: 'retailer',
    productInterest: 'Handloom heritage, block-print collection',
    quantityRequirement: '~80 SKUs / season',
    message: 'Interested in becoming an authorised reseller.',
    status: 'won',
    notes: 'Reseller agreement signed Dec 10.',
    createdAt: D(40),
    updatedAt: D(1),
  },
];
