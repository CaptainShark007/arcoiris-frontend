export interface AdminClient {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string | null;
  is_active: boolean;
}

export interface AdminClientInput {
  full_name: string;
  phone: string;
  email?: string | null;
  is_active?: boolean;
}
