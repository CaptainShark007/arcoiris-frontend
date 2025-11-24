/* export interface Category {
  id: number;
  name: string;
  image: string;
} */

import { Tables } from "@/supabase/supabase";

export type Category = Tables<'categories'>;

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}