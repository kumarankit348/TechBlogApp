import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/slices/users/userSlices";
import postsReducer from "../redux/slices/posts/postSlices";
import categoriesReducer from "../redux/slices/categories/categorySlices";
import commentReducer from "../redux/slices/comments/commentSlices";

// !store
const store = configureStore({
  reducer: {
    users: userReducer,
    posts: postsReducer,
    categories: categoriesReducer,
    comments: commentReducer,
  },
});

export default store;
