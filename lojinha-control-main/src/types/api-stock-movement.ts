export interface ApiStockMovement {
  id: number;
  product_id: number;
  product_name: string;
  type: "entrada" | "saida";
  quantity: number;
  reason: string;
  created_at: string;
}
