export interface ApiProduct {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  min_stock: number;
  price: number;
  cost: number;
  category?: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}
