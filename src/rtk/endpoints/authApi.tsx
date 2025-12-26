import api from "../services";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user data for login/OTP verification
const mockUserData = {
  userId: "user_123",
  email: "admin@example.com",
  fullName: "Admin User",
  role: "admin",
  accessToken: "mock_access_token_12345",
};

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      queryFn: async (_body: {
        email: string;
        password: string;
        deviceToken: string;
        deviceType: string;
        actionType: string;
      }) => {
        await delay(800); // Simulate API delay
        return {
          data: {
            data: {
              token: "mock_otp_token_12345",
            },
          },
        };
      },
    }),
    forgotPassword: builder.mutation({
      queryFn: async (_body: { email: string }) => {
        await delay(800); // Simulate API delay
        return {
          data: {
            data: {
              token: "mock_forgot_password_token_12345",
            },
          },
        };
      },
    }),
    resend: builder.mutation({
      queryFn: async (_body: {
        email: string;
        deviceType: string;
        actionType: string;
      }) => {
        await delay(800); // Simulate API delay
        return {
          data: {
            data: {
              token: "mock_resend_token_12345",
            },
          },
        };
      },
    }),
    resetPassword: builder.mutation({
      queryFn: async (_params: {
        token: string;
        new_password: string;
      }) => {
        await delay(800); // Simulate API delay
        return {
          data: {
            message: "Password reset successfully",
          },
        };
      },
    }),

    verifyOtp: builder.mutation({
      queryFn: async (body: {
        token: string;
        otp: string;
        deviceToken: string;
        deviceType: string;
      }) => {
        await delay(800); // Simulate API delay
        
        // Static data: Accept any OTP for testing purposes
        // In production, this would validate the OTP against the token
        
        // Determine flow based on token type
        // Login flow uses token from login response (contains "otp" or "login")
        // Forgot password flow uses token from forgot password response (contains "forgot")
        const isLoginFlow = 
          body.token.includes("otp") || 
          body.token.includes("login") ||
          (!body.token.includes("forgot") && body.token.length > 0);
        
        if (isLoginFlow) {
          // For login flow, return full user data with accessToken
          return {
            data: {
              data: {
                ...mockUserData,
                accessToken: mockUserData.accessToken,
              },
            },
          };
        } else {
          // Forgot password flow - return accessToken for password reset
          return {
            data: {
              data: {
                accessToken: "mock_reset_password_access_token_12345",
              },
            },
          };
        }
      },
    }),
    logout: builder.mutation({
      queryFn: async () => {
        await delay(500); // Simulate API delay
        return {
          data: {
            message: "Logged out successfully",
          },
        };
      },
    }),
    changePassword: builder.mutation({
      queryFn: async (_body: { oldPassword: string; newPassword: string }) => {
        await delay(800); // Simulate API delay
        return {
          data: {
            message: "Password changed successfully",
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResendMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;
