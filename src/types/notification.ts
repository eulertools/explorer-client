export interface NotificationMessage {
  text?: string;
  details?: any;
}

export interface Notification {
  created_at: string;
  identifier: string;
  item_msg?: NotificationMessage;
  item_read?: boolean;
  item_ref?: string;
  item_type: string;
  user_sub?: string;
}

export enum NotificationType {
  ALERT = 'alert',
  SUBSCRIPTION = 'subscription',
  BUG = 'bug',
  WALLET = 'wallet',
  ADDRESS = 'address',
  TOKEN = 'token',
}
