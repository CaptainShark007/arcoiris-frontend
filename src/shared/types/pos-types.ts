import { AdminClient } from './admin-client';

export type { AdminClient };

export interface PosSaleClient {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}