export interface Partner {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  // user_id?: string;
}

export interface PartnerInput {
  name: string;
  code: string;
}

export interface PartnerSearchFilters {
  page: number;
  limit: number;
  searchTerm?: string;
  status?: 'all' | 'active' | 'inactive';
}