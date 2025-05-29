import { DeleteData, GetData, PostData, PutData } from "@/api/authApi";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  list: GetData("/branches/"),
};
const filialReducer = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addFilial: (state, action) => {
      // state.list.push(action.payload);
      PostData(action.payload, "/branches/");
    },
    updateFilial: (state, action) => {
      PutData("/branches/", `${action.payload.id}/`, action.payload);
    },
    deleteFilial: (state, action) => {
      console.log(action.payload);

      // state.list = state.list.filter((item) => item.id !== action.payload);
      DeleteData("/branches/", `${action.payload}/`);
    },
  },
});

export const { addFilial, updateFilial, updateProduct, deleteFilial } =
  filialReducer.actions;
export default filialReducer.reducer;
