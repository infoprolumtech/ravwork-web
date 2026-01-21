import api from "../services";
import type { ApiResponse } from "../utils/apiTypes";
import type {
  SubscriptionPlan,
  CreateSubscriptionCheckoutRequest,
  CreateSubscriptionCheckoutResponse,
  SubscriptionStatusResponse,
  CancelSubscriptionResponse,
  ResumeSubscriptionResponse,
  ChangePlanRequest,
  ChangePlanResponse,
  UpdatePaymentMethodRequest,
  UpdatePaymentMethodResponse,
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

    // POST /api/v1/subscription/cancel - Cancel subscription
    cancelSubscription: builder.mutation<CancelSubscriptionResponse, void>({
      query: () => ({
        url: "/subscription/cancel",
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<CancelSubscriptionResponse>) => response.data,
      invalidatesTags: ["UserProfile"],
    }),

    // POST /api/v1/subscription/resume - Resume subscription
    resumeSubscription: builder.mutation<ResumeSubscriptionResponse, void>({
      query: () => ({
        url: "/subscription/resume",
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<ResumeSubscriptionResponse>) => response.data,
      invalidatesTags: ["UserProfile"],
    }),

    // POST /api/v1/subscription/change-plan - Change subscription plan
    changePlan: builder.mutation<ChangePlanResponse, ChangePlanRequest>({
      query: (body) => ({
        url: "/subscription/change-plan",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<ChangePlanResponse>) => response.data,
      invalidatesTags: ["UserProfile"],
    }),

    // POST /api/v1/subscription/update-payment-method - Update payment method
    updatePaymentMethod: builder.mutation<UpdatePaymentMethodResponse, UpdatePaymentMethodRequest>({
      query: (body) => ({
        url: "/subscription/update-payment-method",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<UpdatePaymentMethodResponse>) => response.data,
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useLazyGetSubscriptionPlansQuery,
  useCreateSubscriptionCheckoutMutation,
  useGetSubscriptionStatusQuery,
  useLazyGetSubscriptionStatusQuery,
  useCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
  useChangePlanMutation,
  useUpdatePaymentMethodMutation,
} = subscriptionApi;

export default subscriptionApi;

