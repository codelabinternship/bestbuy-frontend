// features/auth/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PostData } from "../../api/authApi";

const initialState = {
  loading: false,
  error: null,
  user: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ rejectWithValue }) => {
    try {
      const response = await PostData(
        {
          user_id: 11111111,
          user_name: "fasdffsd",
          phone_number: "fasdf",
          email: "jfkasldf@gmail.com",
          password: "jklfdskjfsd",
          market_name: "fddsaf",
        },
        "/api/auth/register/"
      );
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
