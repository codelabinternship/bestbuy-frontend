import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useUpdateMarket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await api.put(`/api/api/markets/${id}/`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
