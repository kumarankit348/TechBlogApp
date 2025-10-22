import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

// attach token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ------- USERS -------
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);
export const fetchProfile = () => API.get("/users/profile");

export const getProfile = () => API.get("/users/profile");
export const updateProfile = (data) => API.put("/users/update-profile", data);

// ------- POSTS -------
export const fetchPosts = () => API.get("/posts");
export const fetchPost = (id) => API.get(`/posts/${id}`);
// export const createPost = (formData) => API.post("/posts", formData);
export const updatePost = (id, formData) => API.put(`/posts/${id}`, formData);
export const deletePost = (id) => API.delete(`/posts/${id}`);

// POST ACTIONS
export const likePost = (postId) => API.put(`/posts/like/${postId}`);
export const dislikePost = (postId) => API.put(`/posts/dislike/${postId}`);
export const clapPost = (postId) => API.put(`/posts/claps/${postId}`);
export const addComment = (postId, message) =>
  API.post(`/comments/${postId}`, { message });

// USER ACTIONS
export const followUser = (userId) => API.put(`/users/follow/${userId}`);
export const unfollowUser = (userId) => API.put(`/users/unfollow/${userId}`);

// Posts
export const createPost = (formData) =>
  API.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// User verification check (use profile endpoint)
// export const getProfile = () => API.get("/users/profile");

// ------- COMMENTS -------
export const createComment = (postId, data) =>
  API.post(`/comments/${postId}`, data);
export const updateComment = (commentId, data) =>
  API.put(`/comments/${commentId}`, data);
export const deleteComment = (commentId) =>
  API.delete(`/comments/${commentId}`);

// ------- CATEGORIES -------
export const fetchCategories = () => API.get("/categories");
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const sendVerificationEmail = () =>
  API.put("/users/account-verification-email");

export const verifyAccount = (token) =>
  API.put(`/users/verify-account/${token}`);

export const searchPosts = (filters) => {
  const params = new URLSearchParams(filters).toString();
  return API.get(`/posts/search?${params}`);
};
