// import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/Products";
import categories from "../features/categories/Categories";
import filialReducer from "../features/filial/Filial";
import promocodesReducer from "../features/promocodes/promocodesSlice";
import authReducer from "../features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import DeliveringSlice from "../features/sliceDelivering/deliveringSlice";
import { useDispatch, useSelector } from "react-redux";
import promocodesSlice from "../features/loyality/loyality";
const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categories,
    delivering: DeliveringSlice,
    filial: filialReducer,
    promocodes: promocodesReducer,
    auth: authReducer,
    loyality: promocodesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "products/addProduct",
          "products/updateProduct",
          "categories/addCategory",
          "categories/updateCategory",
        ],
        // Ignore FormData as a value in action payloads
        ignoredActionPaths: ["payload"],
      },
    }),
});
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;
