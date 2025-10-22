// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import {
//   resetErrorAction,
//   resetSuccessAction,
// } from "../globalSlice/globalSlice";

// const INITIAL_STATE = {
//   users: [],
//   user: null,
//   loading: false,
//   error: null,
//   success: false,
//   isUpdating: false,
//   isDeleting: false,
//   isEmailSent: false,
//   isPasswordReset: false,
//   profile: {},
//   userAuth: {
//     error: null,
//     userInfo: localStorage.getItem("userInfo")
//       ? JSON.parse(localStorage.getItem("userInfo"))
//       : null,
//   },
// };

// // -------------------- Thunks (Reducers) --------------------

// // Login Action
// export const loginAction = createAsyncThunk(
//   "users/login",
//   async (payload, { rejectWithValue, getState, dispatch }) => {
//     // make request
//     try {
//       const { data } = await axios.post(
//         "http://localhost:3000/api/v1/users/login",
//         payload
//       );
//       localStorage.setItem("userInfo", JSON.stringify(data));
//       return data;
//     } catch (error) {
//       return rejectWithValue(error?.response?.data);
//     }
//   }
// );

// // Register Action
// export const registerAction = createAsyncThunk(
//   "users/register",
//   async (payload, { rejectWithValue, getState, dispatch }) => {
//     // make request
//     try {
//       const { data } = await axios.post(
//         "http://localhost:3000/api/v1/users/register",
//         payload
//       );
//       return data;
//     } catch (error) {
//       return rejectWithValue(error?.response?.data);
//     }
//   }
// );

// // Logout Action
// export const logoutAction = createAsyncThunk("users/logout", async () => {
//   localStorage.removeItem("userInfo");
//   return true;
// });

// // get public profile Action
// export const userPublicProfileAction = createAsyncThunk(
//   "users/user-public-profile",
//   async (userId, { rejectWithValue, getState, dispatch }) => {
//     // make request
//     try {
//       const token = getState()?.users?.userAuth?.userInfo?.token;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const { data } = await axios.get(
//         `http://localhost:3000/api/v1/users/public-profile/${userId}`,
//         config
//       );
//       return data;
//     } catch (error) {
//       return rejectWithValue(error?.response?.data);
//     }
//   }
// );

// const usersSlice = createSlice({
//   name: "users",
//   initialState: INITIAL_STATE,
//   extraReducers: (builder) => {
//     //login
//     builder.addCase(loginAction.pending, (state, action) => {
//       state.loading = true;
//     });
//     builder.addCase(loginAction.fulfilled, (state, action) => {
//       state.loading = false;
//       state.userAuth.userInfo = action?.payload;
//       state.error = null;
//       state.success = true;
//     });
//     builder.addCase(loginAction.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action?.payload;
//       state.success = false;
//     });

//     //register
//     builder.addCase(registerAction.pending, (state, action) => {
//       state.loading = true;
//     });
//     builder.addCase(registerAction.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action?.payload;
//       state.error = null;
//       state.success = true;
//     });
//     builder.addCase(registerAction.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action?.payload;
//       state.success = false;
//     });

//     //Get user public profile
//     builder.addCase(userPublicProfileAction.pending, (state, action) => {
//       state.loading = true;
//     });
//     builder.addCase(userPublicProfileAction.fulfilled, (state, action) => {
//       state.loading = false;
//       state.profile = action?.payload;
//       state.error = null;
//       state.success = true;
//     });
//     builder.addCase(userPublicProfileAction.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action?.payload;
//     });

//     // ! Reset error action
//     builder.addCase("reset-error-action", (state) => {
//       state.error = null;
//     });
//     // ! Reset success action
//     builder.addCase("reset-success-action", (state) => {
//       state.success = false;
//     });
//   },
// });

// const usersReducer = usersSlice.reducer;
// export default usersReducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import {
//   resetErrorAction,
//   resetSuccessAction,
// } from "../globalSlice/globalSlice";

const INITIAL_STATE = {
  users: [],
  user: null,
  loading: false,
  error: null,
  success: false,
  isUpdating: false,
  isDeleting: false,
  isEmailSent: false,
  isPasswordReset: false,
  profile: {}, // will hold { status, message, user } as your API returns
  userAuth: {
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

// -------------------- Thunks --------------------

let API_URL="https://techblogappbackend.onrender.com/api/v1";

// Login / register / logout / userPublicProfile as before...
export const loginAction = createAsyncThunk(
  "users/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/users/login`,
        payload
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const registerAction = createAsyncThunk(
  "users/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/users/register`,
        payload
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const logoutAction = createAsyncThunk("users/logout", async () => {
  localStorage.removeItem("userInfo");
  return true;
});

export const userPublicProfileAction = createAsyncThunk(
  "users/user-public-profile",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
      const { data } = await axios.get(
        `${API_URL}/users/public-profile/${userId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Follow user
export const followUserAction = createAsyncThunk(
  "users/follow",
  async ({ userId }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // adjust endpoint/method to match your backend
      const { data } = await axios.put(
        `${API_URL}/users/follow/${userId}`,
        {},
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Unfollow user
export const unfollowUserAction = createAsyncThunk(
  "users/unfollow",
  async ({ userId }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/users/unfollow/${userId}`,
        {},
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Block user
export const blockUserAction = createAsyncThunk(
  "users/block",
  async ({ userIdToBlock }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/users/block/${userIdToBlock}`,
        {},
        config
      );
      return data;
    } catch (err) {
      console.error("Block API error:", err.response?.data, err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Unblock user
export const unblockUserAction = createAsyncThunk(
  "users/unblock",
  async ({ userId }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${API_URL}/users/unblock/${userId}`,
        {},
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// users/userSlices.js (thunk)
export const getPrivateProfileAction = createAsyncThunk(
  "users/get-private-profile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      console.log("[THUNK] getPrivateProfileAction token:", token);

      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
      console.log(
        "[THUNK] getPrivateProfileAction config.headers:",
        config.headers
      );

      const { data } = await axios.get(
        `${API_URL}/users/profile`,
        config
      );

      console.log("[THUNK] getPrivateProfileAction response data:", data);
      return data;
    } catch (error) {
      console.error(
        "[THUNK] getPrivateProfileAction error:",
        error?.response?.data || error.message
      );
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Update profile
export const updatePrivateProfileAction = createAsyncThunk(
  "users/updatePrivateProfile",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      if (!token) {
        return rejectWithValue({ status: "Failed", message: "No auth token" });
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // If sending files later you might need 'Content-Type': 'multipart/form-data'
        },
      };

      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        payload,
        config
      );
      return data;
    } catch (err) {
      const payload = err.response?.data || {
        status: "Failed",
        message: err.message,
      };
      console.error("updatePrivateProfileAction error:", payload);
      return rejectWithValue(payload);
    }
  }
);

// -------------------- Slice --------------------

const usersSlice = createSlice({
  name: "users",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    // login
    builder.addCase(loginAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userAuth.userInfo = action.payload;
      state.error = null;
      state.success = true;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // register
    builder.addCase(registerAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
      state.success = true;
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // public profile
    builder.addCase(userPublicProfileAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userPublicProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      // keep the raw API response (you used profile.status/message/user previously)
      state.profile = action.payload;
      state.error = null;
      state.success = true;
    });
    builder.addCase(userPublicProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ---------------- handle follow/unfollow/block/unblock ----------------
    // generic pending
    builder.addCase(followUserAction.pending, (state) => {
      state.isUpdating = true;
      state.error = null;
    });
    builder.addCase(unfollowUserAction.pending, (state) => {
      state.isUpdating = true;
      state.error = null;
    });
    builder.addCase(blockUserAction.pending, (state) => {
      state.isUpdating = true;
      state.error = null;
    });
    builder.addCase(unblockUserAction.pending, (state) => {
      state.isUpdating = true;
      state.error = null;
    });

    // follow fulfilled
    builder.addCase(followUserAction.fulfilled, (state, action) => {
      state.isUpdating = false;
      const me = state.userAuth.userInfo?._id;
      // if backend returned full updated user object
      const returnedUser =
        action.payload?.user ?? action.payload?.profile ?? action.payload;
      if (returnedUser && returnedUser._id) {
        // if payload is full user, put it in profile.user
        state.profile = {
          ...(state.profile || {}),
          user: returnedUser,
        };
      } else if (me && state.profile?.user) {
        // fallback: add me to followers if not present
        state.profile.user.followers = state.profile.user.followers || [];
        if (!state.profile.user.followers.includes(me)) {
          state.profile.user.followers.push(me);
        }
      }
    });

    // unfollow fulfilled
    builder.addCase(unfollowUserAction.fulfilled, (state, action) => {
      state.isUpdating = false;
      const me = state.userAuth.userInfo?._id;
      const returnedUser =
        action.payload?.user ?? action.payload?.profile ?? action.payload;
      if (returnedUser && returnedUser._id) {
        state.profile = {
          ...(state.profile || {}),
          user: returnedUser,
        };
      } else if (me && state.profile?.user) {
        state.profile.user.followers = state.profile.user.followers || [];
        state.profile.user.followers = state.profile.user.followers.filter(
          (id) => id !== me
        );
      }
    });

    // block fulfilled
    builder.addCase(blockUserAction.fulfilled, (state, action) => {
      state.isUpdating = false;
      const me = state.userAuth.userInfo?._id;
      const returnedUser =
        action.payload?.user ?? action.payload?.profile ?? action.payload;
      if (returnedUser && returnedUser._id) {
        state.profile = {
          ...(state.profile || {}),
          user: returnedUser,
        };
      } else if (me && state.profile?.user) {
        state.profile.user.blockedUsers = state.profile.user.blockedUsers || [];
        if (!state.profile.user.blockedUsers.includes(me)) {
          state.profile.user.blockedUsers.push(me);
        }
      }
    });

    // unblock fulfilled
    builder.addCase(unblockUserAction.fulfilled, (state, action) => {
      state.isUpdating = false;
      const me = state.userAuth.userInfo?._id;
      const returnedUser =
        action.payload?.user ?? action.payload?.profile ?? action.payload;
      if (returnedUser && returnedUser._id) {
        state.profile = {
          ...(state.profile || {}),
          user: returnedUser,
        };
      } else if (me && state.profile?.user) {
        state.profile.user.blockedUsers = state.profile.user.blockedUsers || [];
        state.profile.user.blockedUsers =
          state.profile.user.blockedUsers.filter((id) => id !== me);
      }
    });

    // rejections
    builder.addCase(followUserAction.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload || action.error?.message;
    });
    builder.addCase(unfollowUserAction.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload || action.error?.message;
    });
    builder.addCase(blockUserAction.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload || action.error?.message;
    });
    builder.addCase(unblockUserAction.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload || action.error?.message;
    });

    builder
      .addCase(getPrivateProfileAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPrivateProfileAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = true;
      })
      .addCase(getPrivateProfileAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePrivateProfileAction.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updatePrivateProfileAction.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.user = action.payload.user;
        state.success = true;
      })
      .addCase(updatePrivateProfileAction.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });

    // Reset actions you referenced
    builder.addCase("reset-error-action", (state) => {
      state.error = null;
    });
    builder.addCase("reset-success-action", (state) => {
      state.success = false;
    });
  },
});

export default usersSlice.reducer;
