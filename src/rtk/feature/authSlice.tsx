import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: false,
    user: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.isLogin = false;
      state.user = null;
  },
}
});

export const { loginUser, logoutUser } =
  authSlice.actions;
export default authSlice;
