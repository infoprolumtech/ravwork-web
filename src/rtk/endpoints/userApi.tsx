import api from "../services";

// User Profile Types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  displayName: string | null;
  businessDescription: string | null;
  profilePhoto: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  profileStep: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  displayName?: string;
  businessDescription?: string;
  profilePhoto?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
}

// API Response wrapper
interface UserProfileApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserProfile;
}

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/user/profile - Get user profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      transformResponse: (response: UserProfileApiResponse): UserProfile => {
        return response.data;
      },
      providesTags: ["UserProfile"],
    }),
    // PATCH /api/v1/user/profile - Update user profile
    updateUserProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (body) => ({
        url: "/user/profile",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: UserProfileApiResponse): UserProfile => {
        return response.data;
      },
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = userApi;

