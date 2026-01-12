import api from "../services";

// Public Profile Types
export interface FormField {
  id: string;
  label: string;
  fieldType: string;
  placeholder: string;
  options: string[];
  isRequired: boolean;
  sortOrder: number;
}

export interface PublicService {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  icon: string;
  responseTime: string;
  contactMethod: string;
  formFields: FormField[];
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  profilePhoto: string | null;
  businessDescription: string;
  city: string;
  state: string;
  countryCode: string;
  phoneNumber: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  memberSince: string;
}

export interface ServicesData {
  data: PublicService[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    profile: PublicProfile;
    services: ServicesData;
  };
}

export interface GetPublicProfileParams {
  username: string;
  page?: number;
  limit?: number;
  search?: string;
}

// Booking Types
export interface FormFieldResponse {
  fieldId: string;
  value: string | string[];
}

export interface CreateBookingRequest {
  clientName: string;
  clientEmail?: string;
  clientCountryCode: string;
  clientPhone: string;
  serviceId?: string;
  type: "booking" | "inquiry";
  bookingDate?: string;
  bookingTime?: string;
  description?: string;
  responses?: FormFieldResponse[];
}

export interface BookingData {
  id: string;
  userId: string;
  serviceId: string;
  clientId: string;
  type: string;
  bookingDate: string;
  bookingTime: string;
  description: string;
  status: string;
  originalPrice: number;
  createdAt: string;
}

export interface CreateBookingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BookingData;
}

const publicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/public/profile/{username} - Get provider public profile
    getPublicProfile: builder.query<PublicProfileResponse["data"], GetPublicProfileParams>({
      query: ({ username, page = 1, limit = 10, search }) => ({
        url: `/public/profile/${username}`,
        method: "GET",
        params: {
          page,
          limit,
          ...(search && { search }),
        },
      }),
      transformResponse: (response: PublicProfileResponse) => response.data,
    }),
    
    // POST /api/v1/public/profile/{username}/booking - Create a booking
    createBooking: builder.mutation<BookingData, { username: string; body: CreateBookingRequest }>({
      query: ({ username, body }) => ({
        url: `/public/profile/${username}/booking`,
        method: "POST",
        body,
      }),
      transformResponse: (response: CreateBookingResponse) => response.data,
    }),
  }),
});

export const { 
  useGetPublicProfileQuery, 
  useLazyGetPublicProfileQuery,
  useCreateBookingMutation,
} = publicApi;

