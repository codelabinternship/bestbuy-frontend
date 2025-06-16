import promocodesReducer from "../features/promocodes/promocodesSlice";
import { configureStore } from "@reduxjs/toolkit";
import DeliveringSlice from "../features/sliceDelivering/deliveringSlice";
import { useDispatch, useSelector } from "react-redux";
import promocodesSlice from "../features/loyality/loyality";
const store = configureStore({
  reducer: {
    delivering: DeliveringSlice,
    promocodes: promocodesReducer,

    loyality: promocodesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "products/addProduct",
          "products/updateProduct",
          "categories/addCategory",
          "categories/updateCategory",
        ],
        ignoredActionPaths: ["payload"],
      },
    }),
});
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;
