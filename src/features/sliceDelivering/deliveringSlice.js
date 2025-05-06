import { Switch } from "@radix-ui/react-switch";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  list: [
    {
      title: "sdaf",
      description: "",
      id: 1,
      status: false,
    }
  ]
}
const DeliveringSlice = createSlice({
  name: "Delivering",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.list.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    updateSwitchStatus: (state, action) => {
      const { id, status } = action.payload;
      state.list = state.list.map((item) => {
        if (item.id === id) {
          return { ...item, status }
        }
        return item;
      })
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
})
export const { addProduct, updateProduct, deleteProduct, updateSwitchStatus } =
  DeliveringSlice.actions;
export default DeliveringSlice.reducer;