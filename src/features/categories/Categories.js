import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetData, PostData, PutData, DeleteData } from "@/api/authApi";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    const data = await GetData("/categories/");
    return data;
  }
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (category) => {
    const data = await PostData(category, "/categories/");
    return data;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async (category) => {
    const data = await PutData(category, `/categories/${category.id}/`);
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id) => {
    await DeleteData(`/categories/${id}/`);
    return id;
  }
);


const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;