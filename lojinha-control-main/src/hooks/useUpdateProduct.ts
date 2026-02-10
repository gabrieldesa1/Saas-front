import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UpdateProductData {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    min_stock: number;
    price: number;
    cost: number;
    category_id?: number | null;
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateProductData) => {
            const { id, ...payload } = data;
            const response = await api.put(`/products/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}