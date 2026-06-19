export type ContactMessageStatus = 'new' | 'read' | 'closed';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}
