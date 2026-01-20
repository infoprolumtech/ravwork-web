import api from "../services";
import type { ApiResponse, PaginatedData } from "../utils/apiTypes";

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
  finalPrice?: number;
  priceNotes?: string;
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

export type JobsListResponse = PaginatedData<Job>;

export interface UpdateJobStatusRequest {
  status: "completed" | "declined";
  finalPrice?: number;
  priceNotes?: string;
}

export interface UpdateJobStatusResponse {
  id: string;
  status: "completed" | "declined";
  finalPrice?: number;
  completedAt?: string;
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

export type DashboardRequestsListResponse = PaginatedData<DashboardRequest>;

// Dashboard Stats Types
export interface DashboardStatsBucket {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface DashboardStatsData {
  clicks: DashboardStatsBucket;
  bookings: DashboardStatsBucket;
}

// Earnings Types
export interface EarningsItem {
  id: string;
  jobTitle: string;
  date: string;
  earnings: number;
}

export interface EarningsSummary {
  totalEarnings: number;
  totalChange: number;
  weekEarnings: number;
  weekChange: number;
  monthEarnings: number;
  monthChange: number;
}

export interface EarningsData {
  summary: EarningsSummary;
  earnings: PaginatedData<EarningsItem>;
}

export interface GetEarningsParams {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  page?: number;
  limit?: number;
}

export interface ExportEarningsRequest {
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
}

export interface ExportEarningsResponse {
  message: string;
}

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/user/profile - Get user profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<UserProfile>): UserProfile => {
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
      transformResponse: (response: ApiResponse<UserProfile>): UserProfile => {
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
      transformResponse: (response: ApiResponse<JobsListResponse>): JobsListResponse => {
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
      transformResponse: (response: ApiResponse<JobDetails>): JobDetails => {
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
      transformResponse: (response: ApiResponse<DashboardRequestsListResponse>): DashboardRequestsListResponse => {
        return response.data;
      },
      providesTags: ["DashboardRequests"],
    }),

    // GET /api/v1/user/dashboard/stats - Get dashboard stats
    getDashboardStats: builder.query<DashboardStatsData, void>({
      query: () => ({
        url: "/user/dashboard/stats",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DashboardStatsData>): DashboardStatsData => {
        return response.data;
      },
    }),

    // PATCH /api/v1/user/jobs/{id} - Update job status
    updateJobStatus: builder.mutation<UpdateJobStatusResponse, { id: string; body: UpdateJobStatusRequest }>({
      query: ({ id, body }) => ({
        url: `/user/jobs/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponse<UpdateJobStatusResponse>): UpdateJobStatusResponse => {
        return response.data;
      },
      invalidatesTags: ["Jobs"],
    }),

    // GET /api/v1/user/earnings - Get earnings summary and paginated list
    getEarnings: builder.query<EarningsData, GetEarningsParams | void>({
      query: (params) => ({
        url: "/user/earnings",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<EarningsData>): EarningsData => {
        return response.data;
      },
      providesTags: ["Jobs"], // Earnings are related to jobs
    }),

    // POST /api/v1/user/earnings/export - Export earnings to CSV
    exportEarnings: builder.mutation<ExportEarningsResponse, ExportEarningsRequest>({
      query: (body) => ({
        url: "/user/earnings/export",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<ExportEarningsResponse>): ExportEarningsResponse => {
        return response.data;
      },
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
  useGetDashboardStatsQuery,
  useLazyGetDashboardStatsQuery,
  useUpdateJobStatusMutation,
  useGetEarningsQuery,
  useLazyGetEarningsQuery,
  useExportEarningsMutation,
} = userApi;
