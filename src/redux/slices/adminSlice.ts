// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { loginApi } from "@/api/auth-api/loginApi"; // Adjust the import based on your file structure

// // Define your initial state
// // Define your initial state with correct types
// // Function to get a cookie by name
// const getCookie = (name: string) => {
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//   return match ? match[2] : null;
// };

// // Define your initial state with correct types
// const initialState: {
//   token: string | null;
//   user: any | null; // Replace 'any' with the actual type of your user object if known
//   loading: boolean;
//   error: string | null;
// } = {
//   token: getCookie('token'), // Get the token from the cookie if it exists
//   user: null, // You can store user data in cookies or localStorage if needed
//   loading: false,
//   error: null,
// };

// // Function to set a cookie
// const setCookie = (name: string, value: string, days: number) => {
//   const expires = new Date(
//     Date.now() + days * 24 * 60 * 60 * 1000
//   ).toUTCString();
//   document.cookie = `${name}=${value}; expires=${expires}; path=/`;
// };

// // Function to remove a cookie
// const removeCookie = (name: string) => {
//   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
// };

// // Create an async thunk for login
// export const login = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }: { email: string; password: string }) => {
//     const response = await loginApi(email, password);
//     // Store the token in a cookie
//     setCookie("token", response.token, 7); // Set cookie for 7 days
//     return response; // This will return the token and user data
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       // Clear user state
//       state.token = null;
//       state.user = null;
//       // Remove token from cookie
//       removeCookie("token");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       // Fulfilled case
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token ?? null; // Default to null if undefined
//         state.user = action.payload.user ?? null; // Default to null if undefined
//       })

//       // Rejected case
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message ?? null; // Default to null if undefined
//       });
//   },
// });

// // Export the logout action
// export const { logout } = authSlice.actions;

// // Export the reducer
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "@/api/auth-api/loginApi";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginApi(email, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// const loadUserFromLocalStorage = () => {
// try {
//   const storedInfo = localStorage.getItem('dealer_admin');
//   return storedInfo ? JSON.parse(storedInfo) : null;
// } catch (error) {
//    console.error("Error parsing admin info from local storage:", error);
//    return null;
// }
// };
const loadUserFromLocalStorage = () => {
  try {
    const storedInfo = localStorage.getItem("user");
    if (!storedInfo) return null; // Return null if nothing is stored
    return JSON.parse(storedInfo);
  } catch (error) {
    console.error("Error parsing admin info from local storage:", error);
    return null;
  }
};

// Initial state
const initialState = {
  currentSchoolAdmin: loadUserFromLocalStorage(),
  token: null,
  error: null,
  loading: false,
};

// Create slice
const adminSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOutSuccess: (state) => {
      state.currentSchoolAdmin = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      try {
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Error removing admin info from local storage:", error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state: any, action: any) => {
        const { user, token } = action.payload;
        state.currentSchoolAdmin = user;
        state.token = token;
        state.error = null;
        state.loading = false;
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.error("Error saving admin info to local storage:", error);
        }
      })
      .addCase(loginUser.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { signOutSuccess } = adminSlice.actions;

export default adminSlice.reducer;
