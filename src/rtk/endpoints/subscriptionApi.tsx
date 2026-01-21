import api from "../services";
import type { ApiResponse } from "../utils/apiTypes";
import type {
  SubscriptionPlan,
  CreateSubscriptionCheckoutRequest,
  CreateSubscriptionCheckoutResponse,
  SubscriptionStatusResponse,
} from "../../types/subscription";

const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/subscription/plans - Get subscription plans
    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => ({
        url: "/subscription/plans",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<SubscriptionPlan[]>) => response.data,
    }),

    // POST /api/v1/subscription/create - Create subscription checkout session
    createSubscriptionCheckout: builder.mutation<CreateSubscriptionCheckoutResponse, CreateSubscriptionCheckoutRequest>({
      query: (body) => ({
        url: "/subscription/create",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<CreateSubscriptionCheckoutResponse>) => response.data,
    }),

    // GET /api/v1/subscription/status - Get subscription status
    getSubscriptionStatus: builder.query<SubscriptionStatusResponse, void>({
      query: () => ({
        url: "/subscription/status",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<SubscriptionStatusResponse>) => response.data,
      providesTags: ["UserProfile"], // Subscription status is part of user profile
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useLazyGetSubscriptionPlansQuery,
  useCreateSubscriptionCheckoutMutation,
  useGetSubscriptionStatusQuery,
  useLazyGetSubscriptionStatusQuery,
} = subscriptionApi;

export default subscriptionApi;

