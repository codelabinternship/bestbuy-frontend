// lib/hooks/useFilials.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

const fetchFilials = async () => {
  const res = await api.get("/api/branches/");
  return res.data;
};

const addFilial = async (newFilial) => {
  const res = await api.post("/api/branches/", newFilial);
  return res.data;
};

const updateFilial = async ({ id, data }) => {
  const res = await api.put(`/api/branches/${id}/`, data);
  return res.data;
};

const deleteFilial = async (id) => {
  await api.delete(`/api/branches/${id}/`);
};

export function useFilials() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["filials"],
    queryFn: fetchFilials,
  });

  const addFilialMutation = useMutation({
    mutationFn: addFilial,
    onMutate: async (newFilial) => {
      await queryClient.cancelQueries({ queryKey: ["filials"] });
      const previousFilials = queryClient.getQueryData(["filials"]);

      const optimisticFilial = { ...newFilial, id: Date.now() }; // temp ID
      queryClient.setQueryData(["filials"], (old = []) => [
        ...old,
        optimisticFilial,
      ]);

      return { previousFilials };
    },
    onError: (_err, _newFilial, context) => {
      if (context?.previousFilials) {
        queryClient.setQueryData(["filials"], context.previousFilials);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["filials"] });
    },
  });

  const updateFilialMutation = useMutation({
    mutationFn: updateFilial,
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["filials"] });
      const previousFilials = queryClient.getQueryData(["filials"]);

      queryClient.setQueryData(["filials"], (old = []) =>
        old.map((f) => (f.id === id ? { ...f, ...data } : f))
      );

      return { previousFilials };
    },
    onError: (_err, _updated, context) => {
      if (context?.previousFilials) {
        queryClient.setQueryData(["filials"], context.previousFilials);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["filials"] });
    },
  });

  const deleteFilialMutation = useMutation({
    mutationFn: deleteFilial,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["filials"] });
      const previousFilials = queryClient.getQueryData(["filials"]);

      queryClient.setQueryData(["filials"], (old = []) =>
        old.filter((f) => f.id !== id)
      );

      return { previousFilials };
    },
    onError: (_err, _id, context) => {
      if (context?.previousFilials) {
        queryClient.setQueryData(["filials"], context.previousFilials);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["filials"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    addFilialMutation,
    updateFilialMutation,
    deleteFilialMutation,
  };
}
