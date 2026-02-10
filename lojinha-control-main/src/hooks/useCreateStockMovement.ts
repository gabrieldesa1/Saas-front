import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface CreateStockMovementDTO {
  product_id: number
  type: 'entrada' | 'saida'
  quantity: number
  reason?: string
  happened_at?: string
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateStockMovementDTO) => {
      const response = await api.post('/stock-movements', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] })
    }
  })
}
