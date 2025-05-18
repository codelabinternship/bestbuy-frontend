import { GetData, registerUser } from "@/api/authApi";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: GetData("/products/"),
  // {
  //   id: 1,
  //   title: "Premium Hoodie",
  //   description: "<p>High-quality cotton hoodie with a modern fit.</p>",
  //   price: 49.99,
  //   items: 20,
  //   imagePreview:
  //     "https://avatars.mds.yandex.net/i?id=180fb5e58a8e3b77a43379104a8a97f7_l-8386641-images-thumbs&n=13",
  //   videoUrl: null,
  //   salePrice: 45,
  //   comparePrice: 55,
  //   costPrice: 30,
  //   profit: 15,
  //   margin: 33.3,
  //   taxable: true,
  // },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      // state.list.push(action.payload);
      registerUser(
        {
          name: "fadsfasd",
          description: "ffasdf",
          price: 11,
          discount_price: "111",
          stock_quantity: 1,
          brand: "11",
          category: "",
        },
        "/products/"
      );
    },
    updateProduct: (state, action) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
