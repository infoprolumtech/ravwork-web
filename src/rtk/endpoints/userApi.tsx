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

// Job Types
export interface Job {
  id: string;
  type: "booking" | "inquiry";
  status: "pending" | "completed" | "declined";
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  bookingDate?: string;
  bookingTime?: string;
  originalPrice: number;
  createdAt: string;
}

export interface JobDetails extends Job {
  description?: string;
  client?: {
    id: string;
    name: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  };
  formResponses?: Array<{
    question: string;
    answer: string | string[];
  }>;
}

export interface GetJobsParams {
  status?: "pending" | "completed" | "declined";
  page?: number;
  limit?: number;
}

export interface JobsListResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: JobsListResponse;
}

export interface JobDetailsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: JobDetails;
}

// Dashboard Request Types
export interface DashboardRequest {
  id: string;
  type: "booking" | "inquiry";
  clientName: string;
  serviceName: string;
  bookingDate?: string;
  bookingTime?: string;
  createdAt: string;
}

export interface GetDashboardRequestsParams {
  type?: "booking" | "inquiry";
  page?: number;
  limit?: number;
}

export interface DashboardRequestsListResponse {
  data: DashboardRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardRequestsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardRequestsListResponse;
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

    // GET /api/v1/user/jobs - Get paginated list of jobs
    getJobs: builder.query<JobsListResponse, GetJobsParams | void>({
      query: (params) => ({
        url: "/user/jobs",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: JobsApiResponse): JobsListResponse => {
        return response.data;
      },
      providesTags: ["Jobs"],
    }),

    // GET /api/v1/user/jobs/{id} - Get job details
    getJobById: builder.query<JobDetails, string>({
      query: (id) => ({
        url: `/user/jobs/${id}`,
        method: "GET",
      }),
      transformResponse: (response: JobDetailsApiResponse): JobDetails => {
        return response.data;
      },
      providesTags: (_result, _error, id) => [{ type: "Jobs", id }],
    }),

    // GET /api/v1/user/dashboard/requests - Get dashboard requests
    getDashboardRequests: builder.query<DashboardRequestsListResponse, GetDashboardRequestsParams | void>({
      query: (params) => ({
        url: "/user/dashboard/requests",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: DashboardRequestsApiResponse): DashboardRequestsListResponse => {
        return response.data;
      },
      providesTags: ["DashboardRequests"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetJobsQuery,
  useLazyGetJobsQuery,
  useGetJobByIdQuery,
  useLazyGetJobByIdQuery,
  useGetDashboardRequestsQuery,
  useLazyGetDashboardRequestsQuery,
} = userApi;

