import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: {
    open: false,
    message: "",
    severity: "info", // info, success, warning, error
    jobPostModal: {
      jobPostModalShow: false,
      jobPostType: null,
    },
    isRedirection: false,
  },
  reducers: {
    showAlert: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "info";
    },
    closeAlert: (state) => {
      state.open = false;
      state.message = "";
      state.severity = "info";
    },
    showJobPostModal: (state, action) => {
      state.jobPostModal.jobPostModalShow = action.payload.jobPostModalShow;
      state.jobPostModal.jobPostType = action.payload.jobPostType;
    },
    setIsRedirection: (state, action) => {
      state.isRedirection = action.payload;
    },
  },
});

export const { showAlert, closeAlert, showJobPostModal, setIsRedirection } =
  alertSlice.actions;
export default alertSlice;
