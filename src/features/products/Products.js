import { createSlice } from "@reduxjs/toolkit";
import { GetData, PostData, DeleteData, PutData } from "@/api/authApi";

const initialState = {
  list: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
    },
    addProduct: (state, action) => {
      PostData(action.payload, "/products/");
    },
    updateProduct: (state, action) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        PutData(`/products/${action.payload.id}/`, {
          name: "addsf",
          description: "fadsfsdafds",
          price: "123",
          discount_price: "dasdf",
          stock_quantity: 22,
          brand: "artel",
          category: 12,
        }); // Optional
      }
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
      DeleteData(`/products/${action.payload}/`); // Optional
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
