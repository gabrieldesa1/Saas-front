import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://127.0.0.1:8000/api/categories";

export function useCategories() {
  const queryClient = useQueryClient();

  const fetchCategories = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar categorias");
    return response.json();
  };

  const createCategory = useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao criar categoria");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar categoria");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { name: string; color: string };
    }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao atualizar categoria");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    ...useQuery({
      queryKey: ["categories"],
      queryFn: fetchCategories,
    }),
    createCategory,
    deleteCategory,
    updateCategory,
  };
}