/* export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  brand?: string;
}
 */

import { Tables } from "@/supabase/supabase";

export type Product = Tables<"products"> & {
  variants?: Tables<"variants">[]; // opcionalmente incluir variantes
  price: number; // si queres un atajo de precio (por ej. el primero)
  maxPrice?: number;
  hasMultiplePrices?: boolean; // indica si hay rango
  image: string; // imagen principal
}
