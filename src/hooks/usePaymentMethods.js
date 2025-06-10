import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

// API functions
const fetchPaymentMethods = async () => {
  const res = await api.get("/payment-methods/");
  return res.data;
};

const addPaymentMethod = async (newMethod) => {
  const res = await api.post("/payment-methods/", newMethod); // JSON format
  return res.data;
};

const updatePaymentMethod = async ({ id, updatedData }) => {
  const res = await api.put(`/payment-methods/${id}/`, updatedData); // JSON format
  return res.data;
};

const deletePaymentMethod = async (id) => {
  await api.delete(`/payment-methods/${id}/`);
};

// Hook
export function usePaymentMethods() {
  const queryClient = useQueryClient();

  // GET
  const { data, isLoading, error } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: fetchPaymentMethods,
  });

  // POST
  const addPaymentMethodMutation = useMutation({
    mutationFn: addPaymentMethod,
    onMutate: async (newMethod) => {
      await queryClient.cancelQueries({ queryKey: ["payment-methods"] });
      const previousMethods = queryClient.getQueryData(["payment-methods"]);

      queryClient.setQueryData(["payment-methods"], (oldMethods = []) => [
        ...oldMethods,
        newMethod,
      ]);

      return { previousMethods };
    },
    onError: (_err, _newMethod, context) => {
      if (context?.previousMethods) {
        queryClient.setQueryData(["payment-methods"], context.previousMethods);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });

  // PUT
  const updatePaymentMethodMutation = useMutation({
    mutationFn: updatePaymentMethod,
    onMutate: async (updatedMethod) => {
      await queryClient.cancelQueries({ queryKey: ["payment-methods"] });
      const previousMethods = queryClient.getQueryData(["payment-methods"]);

      queryClient.setQueryData(["payment-methods"], (oldMethods = []) =>
        oldMethods.map((method) =>
          method.id === updatedMethod.id ? updatedMethod.updatedData : method
        )
      );

      return { previousMethods };
    },
    onError: (_err, _updatedMethod, context) => {
      if (context?.previousMethods) {
        queryClient.setQueryData(["payment-methods"], context.previousMethods);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });

  // DELETE
  const deletePaymentMethodMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["payment-methods"] });
      const previousMethods = queryClient.getQueryData(["payment-methods"]);

      queryClient.setQueryData(["payment-methods"], (oldMethods = []) =>
        oldMethods.filter((method) => method.id !== id)
      );

      return { previousMethods };
    },
    onError: (_err, _id, context) => {
      if (context?.previousMethods) {
        queryClient.setQueryData(["payment-methods"], context.previousMethods);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    addPaymentMethodMutation,
    updatePaymentMethodMutation,
    deletePaymentMethodMutation,
  };
}
