import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../utils/customBaseQuery";

// Define tag types for cache invalidation
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  endpoints: () => ({}),
});

export default api;
