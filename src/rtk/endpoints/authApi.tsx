import api from "../services";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/auth/login - Login user
    login: builder.mutation({
      query: (body: { 
        email: string; 
        password: string;
        deviceType?: string;
        deviceToken?: string;
      }) => {
        const requestBody: {
          email: string;
          password: string;
          deviceType: string;
          deviceToken?: string;
        } = {
          email: body.email,
          password: body.password,
          deviceType: body.deviceType || "web",
          ...(body.deviceToken && body.deviceToken.trim() !== "" && { deviceToken: body.deviceToken }),
        };
        
        return {
          url: "/auth/login",
          method: "POST",
          body: requestBody,
        };
      },
    }),
    // POST /api/v1/auth/signup - Register a new user
    signup: builder.mutation({
      query: (body: {
        username: string;
        email: string;
        countryCode: string;
        phoneNumber: string;
        password: string;
        deviceType?: string;
        deviceToken?: string;
      }) => {
        const requestBody: {
          username: string;
          email: string;
          countryCode: string;
          phoneNumber: string;
          password: string;
          deviceType: string;
          deviceToken?: string;
        } = {
          username: body.username,
          email: body.email,
          countryCode: body.countryCode,
          phoneNumber: body.phoneNumber,
          password: body.password,
          deviceType: body.deviceType || "web",
          ...(body.deviceToken && body.deviceToken.trim() !== "" && { deviceToken: body.deviceToken }),
        };
        
        return {
          url: "/auth/signup",
          method: "POST",
          body: requestBody,
        };
      },
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
