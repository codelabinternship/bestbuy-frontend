import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

const fetchVariations = async (productId) => {
  const { data } = await api.get("/variations/", {
    params: { product_id: productId },
  });
  return data;
};

const addVariation = async (payload) => {
  const { data } = await api.post("/variations/", payload);
  return data;
};

const updateVariation = async ({ variation_id, formData }) => {
  const { data } = await api.put(`/variations/${variation_id}/`, formData);
  return data;
};

const deleteVariation = async (variation_id) =>
  api.delete(`/variations/${variation_id}/`);

export function useVariations(productId) {
  const qc = useQueryClient();

  // GET 
  const { data = [], isLoading } = useQuery({
    queryKey: ["variations", productId],
    queryFn: () => fetchVariations(productId),
    enabled: !!productId,
  });

  //post
  const addVariationMutation = useMutation({
    mutationFn: addVariation,
    onSuccess: () => qc.invalidateQueries(["variations", productId]),
  });

  // put
  const updateVariationMutation = useMutation({
    mutationFn: updateVariation,
    onSuccess: () => qc.invalidateQueries(["variations", productId]),
  });

  // dlte
  const deleteVariationMutation = useMutation({
    mutationFn: deleteVariation,
    onSuccess: () => qc.invalidateQueries(["variations", productId]),
  });

  return {
    data,
    isLoading,
    addVariationMutation,
    updateVariationMutation,
    deleteVariationMutation,
  };
}
