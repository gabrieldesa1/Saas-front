import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useStockMovements() {
    return useQuery({
        queryKey: ['stock-movements'],
        queryFn: async () => {
            const response = await api.get('/stock-movements')

             console.log("RESPOSTA API:", response.data) // 👈 ADD ISSO

             
            return response.data
        }
    })
}