import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

const fetchProducts = async () => {
  const res = await api.get("/api/products/");
  return res.data;
};

export const addProduct = async (newProduct) => {
  const res = await api.post("/api/products/", newProduct, {
    headers: { "Content-Type": "multipart/form-data" },
  }); // JSON

  return res.data;
};

const updateProduct = async ({ id, formData }) => {
  console.log(formData);

  const res = await api.put(`/api/products/${id}/`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

const deleteProduct = async (id) => {
  await api.delete(`/api/products/${id}/`);
};

//  hook
export function useProducts() {
  const queryClient = useQueryClient();

  // get
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  //         post
  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (oldProducts = []) => [
        ...oldProducts,
        newProduct,
      ]);

      return { previousProducts };
    },
    onError: (_err, _newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  //     update
  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (oldProducts = []) =>
        oldProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );

      return { previousProducts };
    },
    onError: (_err, _updatedProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // delete
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (oldProducts = []) =>
        oldProducts.filter((product) => product.id !== id)
      );

      return { previousProducts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    addProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
}
