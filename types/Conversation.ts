import type { User } from './User';
import type { Message } from './Message';

export type Conversation = {
  '@id': number;
  '@type': 'Conversation';
  id: number;
  name?: string;
  type?: string;
  users?: User[];
  created_by?: User;
  created_at?: Date;
  lastActivity?: string;
  avatar_url?: string;
  messages?: Message[];
  lastActiveUser?: User;
  lastMessage: Message;
};
