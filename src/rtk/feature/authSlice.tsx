import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types";

const initialState: AuthState = {
  isLogin: false,
  user: null,
  signupToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      state.isLogin = true;
      state.user = action.payload;
      state.signupToken = null; // Clear signup token on login
    },
    logoutUser: (state) => {
      state.isLogin = false;
      state.user = null;
      state.signupToken = null;
    },
    setSignupToken: (state, action: PayloadAction<string>) => {
      state.signupToken = action.payload;
    },
    clearSignupToken: (state) => {
      state.signupToken = null;
    },
  },
});

export const { loginUser, logoutUser, setSignupToken, clearSignupToken } = authSlice.actions;
export default authSlice;
