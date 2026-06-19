export type NotificationType = 'order' | 'broadcast' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  relatedOrderId?: number;
}
