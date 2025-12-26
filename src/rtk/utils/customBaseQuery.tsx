import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { Mutex } from "async-mutex";
import { showAlert } from "../feature/alertSlice";

// Create a mutex to prevent concurrent token refreshes
const mutex = new Mutex();

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  // credentials: "include", // 👈 this is equivalent to axios's withCredentials: true
  prepareHeaders: (headers, { getState }) => {
    headers.set("user-agent", "");
    headers.set("ngrok-skip-browser-warning", "true");
    const state = getState() as any;
    const user = state.auth.user;

    if (user?.accessToken) {
      headers.set("Authorization", `Bearer ${user.accessToken}`);
    }
    
 
    
    return headers;
  },
});

// Enhanced base query with re-authentication logic
export const baseQueryWithReauth: BaseQueryFn<
  any,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  const errorMessage =
    (result?.error?.data as any)?.message ||
    (result?.error?.data as any)?.error ||
    (result?.error?.data as any)?.detail ||
    "Something went wrong.";

  if (result?.error)
    api.dispatch(
      showAlert({
        message: errorMessage,
        severity: "error",
      })
    );

  if (result?.error?.status === 498) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
      } catch (err) {
        localStorage.clear();
      } finally {
        release();
      }
    }
  } else if (result?.error?.status === 440) {
    window.location.href = "/";
    localStorage.removeItem("persist:persist");
  } else {
    await mutex.waitForUnlock();
  }

  return result;
};
