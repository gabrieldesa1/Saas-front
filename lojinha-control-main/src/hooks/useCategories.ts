import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; // seu axios instance

export function useCategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data;
    },
  });

  const createCategory = useMutation({
    mutationFn: async (newCategory: {
      name: string;
      color: string;
    }) => {
      const { data } = await api.post("/categories", newCategory);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    ...query,
    createCategory,
  };
}