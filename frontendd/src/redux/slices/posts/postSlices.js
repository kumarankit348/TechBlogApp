import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  resetErrorAction,
  resetSuccessAction,
} from "../globalSlice/globalSlice";

const INITIAL_STATE = {
  posts: [],
  post: null,
  loading: false,
  error: null,
  success: false,
};

let API_URL="https://techblogappbackend.onrender.com/api/v1";


// Fetch Public Post Action
export const fetchPublicPostsAction = createAsyncThunk(
  "posts/fetch-public-posts",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const { data } = await axios.get(
        `${API_URL}/posts/public`
      );
      console.log("Public posts API:", data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch Private Post Action
export const fetchPrivatePostsAction = createAsyncThunk(
  "posts/fetch-private-posts",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `${API_URL}/posts/`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch Single Post Action
export const getPostAction = createAsyncThunk(
  "posts/get-post",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const { data } = await axios.get(
        `${API_URL}/posts/${postId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Create post Action
export const addPostAction = createAsyncThunk(
  "posts/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      // convert payload to form data
      const formData = new FormData();
      formData.append("title", payload?.title);
      formData.append("content", payload?.content);
      formData.append("category", payload?.category);
      formData.append("image", payload?.image);
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}/posts`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update post Action
export const updatePostAction = createAsyncThunk(
  "posts/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      // convert payload to form data
      const formData = new FormData();
      formData.append("title", payload?.title);
      formData.append("content", payload?.content);
      formData.append("category", payload?.category);
      formData.append("image", payload?.image);
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/posts/${payload?.postId}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete post Action
export const deletePostAction = createAsyncThunk(
  "posts/delete-post",
  async (postId, { rejectWithValue, getState }) => {
    // make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(
        `${API_URL}/posts/${postId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// like Post Action
export const likePostAction = createAsyncThunk(
  "posts/like",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/posts/like/${postId}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// dislike Post Action
export const dislikePostAction = createAsyncThunk(
  "posts/dislike",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/posts/dislike/${postId}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// clap Post Action
export const clapPostAction = createAsyncThunk(
  "posts/clap",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/posts/claps/${postId}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// post view count Action
export const postViewCountAction = createAsyncThunk(
  "posts/post-view",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/posts/${postId}/post-view-count`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// ! posts slice
const postsSlice = createSlice({
  name: "posts",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    // fetch public posts
    builder.addCase(fetchPublicPostsAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchPublicPostsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action?.payload?.posts || []; // <-- only the array
      state.error = null;
      // state.success = true;
    });
    builder.addCase(fetchPublicPostsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
      state.success = false;
    });

    // fetch private posts
    builder.addCase(fetchPrivatePostsAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchPrivatePostsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action?.payload?.allPosts || []; // <-- only the array
      state.error = null;
      // state.success = true;
    });
    builder.addCase(fetchPrivatePostsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
      state.success = false;
    });

    // Get single posts
    builder.addCase(getPostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.error = null;
      // state.success = true;
    });
    builder.addCase(getPostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
      state.success = false;
    });

    //create post
    builder.addCase(addPostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.error = null;
      state.success = true;
    });
    builder.addCase(addPostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
      state.success = false;
    });

    //update post
    builder.addCase(updatePostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.error = null;
      state.success = true;
    });
    builder.addCase(updatePostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
    });

    // like posts
    builder.addCase(likePostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(likePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.error = null;
      // state.success = true;
    });
    builder.addCase(likePostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
      state.success = false;
    });

    // dislike posts
    builder.addCase(dislikePostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(dislikePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.error = null;
    });
    builder.addCase(dislikePostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
    });

    //delete post
    builder.addCase(deletePostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
    });
    builder.addCase(deletePostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
      state.success = false;
      state.error = action?.payload;
    });

    // clap posts
    builder.addCase(clapPostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(clapPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.error = null;
    });
    builder.addCase(clapPostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
    });

    //  post view count
    builder.addCase(postViewCountAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postViewCountAction.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.error = null;
    });
    builder.addCase(postViewCountAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload;
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
const postsReducer = postsSlice.reducer;
export default postsReducer;
