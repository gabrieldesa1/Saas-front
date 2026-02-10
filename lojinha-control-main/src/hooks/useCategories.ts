import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

/**
 * Tipo exatamente no formato que a API devolve
 * (snake_case, sem adaptação desnecessária)
 */

export interface ApiCategory {
    id: number;
    name: string;
    color: string;
    product_count?: number;
}

export function useCategories(){
    return useQuery<ApiCategory[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get<ApiCategory[]>("/categories");
            return data;
        },
    });
}