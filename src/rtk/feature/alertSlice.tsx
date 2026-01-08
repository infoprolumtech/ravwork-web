import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AlertState,
  ShowAlertPayload,
  ShowJobPostModalPayload,
} from "../../types";

const initialState: AlertState = {
  open: false,
  message: "",
  severity: "info",
  jobPostModal: {
    jobPostModalShow: false,
    jobPostType: null,
  },
  isRedirection: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<ShowAlertPayload>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "info";
    },
    closeAlert: (state) => {
      state.open = false;
      state.message = "";
      state.severity = "info";
    },
    showJobPostModal: (state, action: PayloadAction<ShowJobPostModalPayload>) => {
      state.jobPostModal.jobPostModalShow = action.payload.jobPostModalShow;
      state.jobPostModal.jobPostType = action.payload.jobPostType;
    },
    setIsRedirection: (state, action: PayloadAction<boolean>) => {
      state.isRedirection = action.payload;
    },
  },
});

export const { showAlert, closeAlert, showJobPostModal, setIsRedirection } =
  alertSlice.actions;
export default alertSlice;
