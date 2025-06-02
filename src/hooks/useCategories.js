import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// GET
const fetchCategories = async () => {
  const res = await api.get("/categories/");
  return res.data;
};

// POST
const addCategory = async (formData) => {
  const res = await api.post("/categories/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// PUT
const updateCategory = async ({ id, formData }) => {
  const res = await api.put(`/categories/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE
const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}/`);
};

export function useCategories() {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
}
