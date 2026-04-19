import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { Mutex } from "async-mutex";
import { showAlert } from "../feature/alertSlice";
import { logoutUser } from "../feature/authSlice";

// Create a mutex to prevent concurrent token refreshes
const mutex = new Mutex();

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set("user-agent", "");
    const state = getState() as {
      auth: {
        user: { accessToken?: string } | null;
        signupToken: string | null;
      };
    };
    const user = state.auth.user;
    const signupToken = state.auth.signupToken;

    // Check for token in Redux store first (logged in user)
    if (user?.accessToken) {
      headers.set("Authorization", `Bearer ${user.accessToken}`);
    } else if (signupToken) {
      // Use signup token for authenticated calls during signup flow
      headers.set("Authorization", `Bearer ${signupToken}`);
    }

    return headers;
  },
});

// Helper function to handle token expiration
const handleTokenExpiration = (api: any) => {
  // Clear auth state
  api.dispatch(logoutUser());
  // Clear persisted state
  localStorage.removeItem("persist:persist");
  // Redirect to login page
  window.location.href = "/login";
};

// Enhanced base query with re-authentication logic
export const baseQueryWithReauth: BaseQueryFn<
  any,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // Check if this is a login or signup request (these should show errors on 401, not redirect)
  const isAuthRequest =
    typeof args === "object" && args !== null && "url" in args
      ? args.url === "/auth/login" || args.url === "/auth/signup"
      : false;

  // Handle token expiration (401 Unauthorized)
  // But NOT for login/signup requests - those should show errors
  if (result?.error?.status === 401 && !isAuthRequest) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        handleTokenExpiration(api);
      } finally {
        release();
      }
    }
    // Don't show error alert for token expiration, just redirect
    return result;
  }

  // Extract error message for other errors
  const errorMessage =
    (result?.error?.data as any)?.message ||
    (result?.error?.data as any)?.error ||
    (result?.error?.data as any)?.detail ||
    "Something went wrong.";

  // Show error alert for non-auth errors OR for login/signup 401 errors
  // (login/signup 401s should show errors, not redirect)
  if (result?.error && (result?.error?.status !== 401 || isAuthRequest)) {
    api.dispatch(
      showAlert({
        message: errorMessage,
        severity: "error",
      }),
    );
  }

  if (result?.error?.status === 498) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        handleTokenExpiration(api);
      } catch (err) {
        localStorage.clear();
      } finally {
        release();
      }
    }
  } else if (result?.error?.status === 440) {
    handleTokenExpiration(api);
  } else {
    await mutex.waitForUnlock();
  }

  return result;
};
