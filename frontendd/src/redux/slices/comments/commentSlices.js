import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// imports kept (you can remove unused ones)
import {
  resetErrorAction,
  resetSuccessAction,
} from "../globalSlice/globalSlice";

const INITIAL_STATE = {
  comments: [],
  comment: null,
  loading: false,
  error: null,
  success: false,
};

// Create Comment Action
export const createCommentAction = createAsyncThunk(
  "comments/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/comments/${payload?.postId}`,
        { message: payload?.message },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error.message }
      );
    }
  }
);

// comment slice
const commentSlice = createSlice({
  name: "comments",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    // create comment pending
    builder.addCase(createCommentAction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });

    // create comment fulfilled (single handler only)
    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.posts = action.payload;

      // backend returns: { status: "success", message: "...", comment: {...} }
      // const created = action?.payload?.comment;
      // if (created) {
      //   state.comments = state.comments || [];
      //   state.comments.push(created);
      // }
    });

    // create comment rejected
    builder.addCase(createCommentAction.rejected, (state, action) => {
      state.loading = false;
      // prefer payload (rejectWithValue) then fallback to action.error
      state.error =
        action?.payload?.message ||
        action.error?.message ||
        action?.payload ||
        null;
    });

    // Reset error action
    builder.addCase("reset-error-action", (state) => {
      state.error = null;
    });

    // Reset success action
    builder.addCase("reset-success-action", (state) => {
      state.success = false;
    });
  },
});

export default commentSlice.reducer;
