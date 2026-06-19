export type WholesaleInquiryStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export interface WholesaleInquiry {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType?: string;
  productInterest?: string;
  quantityRequirement?: string;
  message?: string;
  status: WholesaleInquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

