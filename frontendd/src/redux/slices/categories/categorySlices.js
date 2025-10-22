import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  resetErrorAction,
  resetSuccessAction,
} from "../globalSlice/globalSlice";

const INITIAL_STATE = {
  categories: [],
  category: null,
  loading: false,
  error: null,
  success: false,
};

// Fetch categories Action
export const fetchCategoriesAction = createAsyncThunk(
  "categories/lists",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/categories"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// ! categories slice
const categoriesSlice = createSlice({
  name: "categories",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    //fetch categories
    builder.addCase(fetchCategoriesAction.pending, (state, action) => {
      state.loading = true;
    });
    // handle fullfilled state
    builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action?.payload;
      state.error = null;
      state.success = true;
    });
    // handle rejected state
    builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
      state.success = false;
    });

    // ! Reset error action
    builder.addCase("reset-error-action", (state) => {
      state.error = null;
    });
    // ! Reset success action
    builder.addCase("reset-success-action", (state) => {
      state.success = false;
    });
  },
});

// Generate reducer
const categoriesReducer = categoriesSlice.reducer;
export default categoriesReducer;
