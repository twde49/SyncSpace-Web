import type { User } from "./User";

export type Notification = {
  '@id': number;
  '@type': 'Notification';
  id: number;
  title?: string;
  content?: string;
  createdAt?: string;
  isRead?: boolean;
  relatedTo: User;
};