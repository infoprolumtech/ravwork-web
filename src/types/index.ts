// Centralized type definitions for the application

// User types
export interface User {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  companyName?: string;
  displayName?: string | null;
  businessDescription?: string | null;
  profilePhoto?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  linkedinUrl?: string | null;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  profileStep?: number; // Signup progress: 1=Step1 done, 2=Step2 done, 3=complete
}

// Auth state types
export interface AuthState {
  isLogin: boolean;
  user: User | null;
  signupToken: string | null; // Temporary token during signup flow (before login)
  subscriptionStatus: import("./subscription").SubscriptionStatusResponse | null;
}

// Alert types
export type AlertSeverity = "info" | "success" | "warning" | "error";

export interface AlertState {
  open: boolean;
  message: string;
  severity: AlertSeverity;
  jobPostModal: {
    jobPostModalShow: boolean;
    jobPostType: string | null;
  };
  isRedirection: boolean;
}

export interface ShowAlertPayload {
  message: string;
  severity?: AlertSeverity;
}

export interface ShowJobPostModalPayload {
  jobPostModalShow: boolean;
  jobPostType: string | null;
}

// API Error types
export interface ApiError {
  message?: string;
  error?: string;
  detail?: string;
  statusCode?: number;
}

export interface ApiErrorResponse {
  data?: ApiError;
  status?: number;
  error?: FetchBaseQueryError;
}

// Redux Root State
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface RootState {
  auth: AuthState;
  alert: AlertState;
  api: unknown; // RTK Query state
}

// Environment variable types
export interface EnvVariables {
  VITE_BASE_URL: string;
  VITE_AES_KEY: string;
  VITE_IV_KEY: string;
  VITE_AES_SECRET_KEY?: string;
  VITE_PUBLIC_ENV?: "DEV" | "PROD";
}


