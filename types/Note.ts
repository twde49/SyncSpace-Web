import type { User } from "./User";

export type Note = {
  '@id': number;
  '@type': 'Note';
  id: number
  title?: string
  content?: string;
  author?: User;
  createdAt?: string;
  updatedAt?: string;
};