import api from "../services";

// Type definitions for Service API
export interface FormField {
  id?: string;
  label: string;
  // "images" is the current API fieldType for image upload; "file" kept for backward compatibility
  fieldType: "text" | "textarea" | "select" | "checkbox" | "radio" | "date" | "time" | "number" | "email" | "phone" | "images" | "file";
  placeholder?: string;
  options?: string[];
  isRequired: boolean;
  sortOrder: number;
}

export interface Service {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  responseTime: "within_1_hour" | "within_24_hours" | "within_48_hours" | "flexible" | null;
  contactMethod: "quick_contact" | "custom_form";
  isActive: boolean;
  sortOrder: number;
  formFields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string | null;
  price: number | null;
  responseTime: "within_1_hour" | "within_24_hours" | "within_48_hours" | "flexible" | null;
  contactMethod: "quick_contact" | "custom_form";
  formFields?: FormField[];
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string | null;
  price?: number | null;
  responseTime?: "within_1_hour" | "within_24_hours" | "within_48_hours" | "flexible" | null;
  contactMethod?: "quick_contact" | "custom_form";
  isActive?: boolean;
  formFields?: FormField[];
}

export interface ServiceApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Service | Service[] | ServicesListResponse | null;
}

export interface GetServicesParams {
  page?: number;
  limit?: number;
}

export interface ServicesListResponse {
  data: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServicesListApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ServicesListResponse;
}

const serviceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/service - Create a new service
    createService: builder.mutation<ServiceApiResponse, CreateServiceRequest>({
      query: (body) => ({
        url: "/service",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services"],
    }),

    // GET /api/v1/service - List all services
    getServices: builder.query<ServicesListResponse | Service[], GetServicesParams | void>({
      query: (params) => ({
        url: "/service",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: ServiceApiResponse | ServicesListApiResponse): ServicesListResponse | Service[] => {
        // Handle both paginated and non-paginated responses
        if (response.data && Array.isArray(response.data)) {
          // Non-paginated response (array of services)
          return response.data;
        }
        // Paginated response
        return (response as ServicesListApiResponse).data;
      },
      providesTags: ["Services"],
    }),

    // GET /api/v1/service/{id} - Get service by ID
    getServiceById: builder.query<ServiceApiResponse, string>({
      query: (id) => ({
        url: `/service/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Services", id }],
    }),

    // PATCH /api/v1/service/{id} - Update service
    updateService: builder.mutation<ServiceApiResponse, { id: string; body: UpdateServiceRequest }>({
      query: ({ id, body }) => ({
        url: `/service/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Services", id },
        "Services",
      ],
    }),

    // DELETE /api/v1/service/{id} - Delete service
    deleteService: builder.mutation<ServiceApiResponse, string>({
      query: (id) => ({
        url: `/service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Services", id },
        "Services",
      ],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useLazyGetServiceByIdQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;

