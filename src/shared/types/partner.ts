export interface Partner {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  // user_id?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  schedule?: string | null;
  map_url?: string | null;
}

export interface PartnerInput {
  name: string;
  code: string;
  phone?: string;
  email?: string;
  address?: string;
  schedule?: string;
  map_url?: string;
}

export interface PartnerSearchFilters {
  page: number;
  limit: number;
  searchTerm?: string;
  status?: 'all' | 'active' | 'inactive';
}