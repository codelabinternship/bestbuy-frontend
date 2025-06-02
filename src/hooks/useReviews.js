import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useReviews = () => {
  const queryClient = useQueryClient();

  const fetchReviews = async () => {
    const res = await api.get("/api/reviews/");
    return res.data;
  };

  const deleteReview = async (id) => {
    await api.delete(`/api/reviews/${id}/`);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  return {
    reviews: data || [],
    isLoading,
    error,
    deleteReview: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
