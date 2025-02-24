import { Client } from './client.model';

export interface User extends Client {
  email: string;
  role: 'admin' | 'user';
}
