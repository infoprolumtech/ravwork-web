import api from "../services";
import type { ApiResponse } from "../utils/apiTypes";
import type { User } from "../../types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthData {
  user: User;
  tokens?: AuthTokens;
  accessToken?: string;
  refreshToken?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  businessDescription?: string;
  profilePhoto?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword: string;
}

export interface GeneratePresignedUrlRequest {
  type: "PUT" | "GET";
  files: Array<{
    folderName: string;
    fileName: string;
  }>;
}

const getAuthRequestBody = <T extends object>(body: T) => ({
  deviceType: "web",
  ...body,
});

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/auth/login - Login user
    login: builder.mutation<AuthData, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body: getAuthRequestBody(body),
      }),
      transformResponse: (response: ApiResponse<AuthData>) => response.data,
    }),

    // POST /api/v1/auth/signup - Register a new user
    signup: builder.mutation<AuthData, SignupRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body: getAuthRequestBody(body),
      }),
      transformResponse: (response: ApiResponse<AuthData>) => response.data,
    }),

    // GET /api/v1/auth/me - Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      providesTags: ["UserProfile"],
    }),

    // PUT /api/v1/auth/profile - Complete profile setup
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: ["UserProfile"],
    }),

    // POST /api/v1/auth/profile/skip - Skip profile setup
    skipProfile: builder.mutation<User, void>({
      query: () => ({
        url: "/auth/profile/skip",
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: ["UserProfile"],
    }),

    // POST /api/v1/auth/forgot-password - Request password reset
    forgotPassword: builder.mutation<null, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<null>) => response.data,
    }),

    // POST /api/v1/auth/reset-password - Reset password
    resetPassword: builder.mutation<null, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<null>) => response.data,
    }),

    // POST /api/v1/auth/logout - Logout user
    logout: builder.mutation<null, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<null>) => response.data,
    }),

    // POST /api/v1/auth/change-password - Change password
    changePassword: builder.mutation<null, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<null>) => response.data,
    }),

    // POST /api/v1/user/signed-urls - Generate presigned URLs for S3 upload
    generatePresignedUrl: builder.mutation<Array<{ signedUrl: string }>, GeneratePresignedUrlRequest>({
      query: (body) => ({
        url: "/user/signed-urls",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Array<{ signedUrl: string }>>) => response.data,
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

export default authApi;
