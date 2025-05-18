import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { GetData, registerUser } from "@/api/authApi";

const initialState = {
  list: GetData("/categories/"),
  //  {
  //     id: 3,
  //     title: "Ноутбуки и компьютеры",
  //     description:
  //       "<p>Track your health and fitness with this sleek smartwatch.</p>",
  //     price: 199.99,
  //     items: 10,
  //     imagePreview:
  //       "https://avatars.mds.yandex.net/i?id=2796348e6608eb7d4dee859fefa1ac27742c7374-10310276-images-thumbs&n=13",
  //     videoUrl: null,
  //     profit: 80,
  //     margin: 40,
  //     taxable: true,
  //     date: [1, "June", 2025],
  //   },
};

const categoriesSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.list.push(action.payload);
      registerUser(action.payload, "/products/");
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
  categoriesSlice.actions;
export default categoriesSlice.reducer;
