import api from "../services";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/auth/login - Login user
    login: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    // POST /api/v1/auth/signup - Register a new user
    signup: builder.mutation({
      query: (body: {
        username: string;
        email: string;
        countryCode: string;
        phoneNumber: string;
        password: string;
      }) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
    // GET /api/v1/auth/me - Get current user
    getCurrentUser: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    // PUT /api/v1/auth/profile - Complete profile setup
    updateProfile: builder.mutation({
      query: (body: {
        displayName?: string;
        businessDescription?: string;
        profilePhoto?: string;
        instagramUrl?: string;
        facebookUrl?: string;
        linkedinUrl?: string;
      }) => ({
        url: "/auth/profile",
        method: "PUT",
        body,
      }),
    }),
    // POST /api/v1/auth/profile/skip - Skip profile setup
    skipProfile: builder.mutation({
      query: () => ({
        url: "/auth/profile/skip",
        method: "POST",
      }),
    }),
    // POST /api/v1/auth/forgot-password - Request password reset
    forgotPassword: builder.mutation({
      query: (body: { email: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    // POST /api/v1/auth/reset-password - Reset password
    resetPassword: builder.mutation({
      query: (body: { token: string; newPassword: string }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: {
          token: body.token, // Ensure token is sent as-is without additional encoding
          newPassword: body.newPassword,
        },
      }),
    }),
    // POST /api/v1/auth/logout - Logout user
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    // POST /api/v1/auth/change-password - Change password (if exists)
    changePassword: builder.mutation({
      query: (body: { oldPassword: string; newPassword: string }) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
    // POST /api/v1/user/signed-urls - Generate presigned URLs for S3 upload
    generatePresignedUrl: builder.mutation({
      query: (body: {
        type: "PUT" | "GET";
        files: Array<{
          folderName: string;
          fileName: string;
        }>;
      }) => ({
        url: "/user/signed-urls",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateProfileMutation,
  useSkipProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useGeneratePresignedUrlMutation,
} = authApi;
