import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

const API_URL = "/api/delivery-departments/";

// GET
const fetchDeliveryDepartments = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

// POST
export const addDepartment = async (newDepartment) => {
  const res = await api.post(API_URL, newDepartment, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// PUT
export const updateDepartment = async ({ id, updatedData }) => {
  const res = await api.put(`${API_URL}${id}/`, updatedData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// DELETE
export const deleteDepartment = async (id) => {
  await api.delete(`${API_URL}${id}/`);
};

export function useDeliveryDepartments() {
  const queryClient = useQueryClient();

  // GET
  const { data, isLoading, error } = useQuery({
    queryKey: ["delivery-departments"],
    queryFn: fetchDeliveryDepartments,
  });

  // POST
  const addMutation = useMutation({
    mutationFn: addDepartment,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["delivery-departments"] });
      const previousData = queryClient.getQueryData(["delivery-departments"]);

      queryClient.setQueryData(["delivery-departments"], (old = []) => [
        ...old,
        newItem,
      ]);

      return { previousData };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["delivery-departments"],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-departments"] });
    },
  });

  // PUT
  const updateMutation = useMutation({
    mutationFn: updateDepartment,
    onMutate: async ({ id, updatedData }) => {
      await queryClient.cancelQueries({ queryKey: ["delivery-departments"] });
      const previousData = queryClient.getQueryData(["delivery-departments"]);

      queryClient.setQueryData(["delivery-departments"], (old = []) =>
        old.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
      );

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["delivery-departments"],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-departments"] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["delivery-departments"] });
      const previousData = queryClient.getQueryData(["delivery-departments"]);

      queryClient.setQueryData(["delivery-departments"], (old = []) =>
        old.filter((item) => item.id !== id)
      );

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["delivery-departments"],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-departments"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    addDepartment: addMutation.mutate,
    updateDepartment: updateMutation.mutate,
    deleteDepartment: deleteMutation.mutate,
  };
}
