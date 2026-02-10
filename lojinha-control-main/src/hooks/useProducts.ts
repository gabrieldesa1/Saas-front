import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiProduct } from "@/types/api-product";
import { Product } from "@/types/inventory";

function mapApiProduct(api: ApiProduct): Product {
  return {
    id: String(api.id),
    name: api.name,
    sku: api.sku,
    category: api.category?.name ?? "",
    quantity: api.quantity,
    minStock: api.min_stock,
    price: api.price,
    cost: api.cost,
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<ApiProduct[]>("/products");
      return data.map(mapApiProduct);
    },
  });
}
