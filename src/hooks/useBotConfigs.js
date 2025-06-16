import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useBotConfigs = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["bot-configs"],
    queryFn: async () => {
      const res = await api.get("/bot-configs/");
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: (data) => api.post("/bot-configs/", data),
    onSuccess: () => queryClient.invalidateQueries(["bot-configs"]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/bot-configs/${id}/`, data),
    onSuccess: () => queryClient.invalidateQueries(["bot-configs"]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/bot-configs/${id}/`),
    onSuccess: () => queryClient.invalidateQueries(["bot-configs"]),
  });

  return {
    data: data || [],
    isLoading,
    addMutation,
    updateMutation,
    deleteMutation,
  };
};
