import { useRoutes, Navigate } from "react-router-dom";

// Auth & Common Pages
import LoginPage from "../pages/login";
import SignUpPage from "../pages/signup";
import ForgotPassword from "../pages/forgot-password";
import CheckMail from "../pages/check-mail";
import ResetPasswordPage from "../pages/reset-password";
import ChangePasswordPage from "../pages/change-password";
import OTPVerificationPage from "../pages/otp-verification";

// Main App Pages (7 menu items)
import Dashboard from "../pages/dashboard";
import MyJobs from "../pages/my-jobs";
import ServicesOffered from "../pages/services-offered";
import AddEditServicePage from "../pages/services-offered/add-edit";
import Earnings from "../pages/earnings";
import MyProfile from "../pages/my-profile";
import Notifications from "../pages/notifications";
import ManageSubscription from "../pages/subscription-services";
import EditProfile from "../pages/my-profile/[id]";
import ClientPage from "../pages/client";
import LandingPage from "../pages/landing-page";
import PrivacyPolicy from "../pages/privacy-policy";
import TermsAndConditions from "../pages/terms-and-conditions";

import PublicRoute from "./PublicRoutes";
import PrivateRoute from "./PrivateRoutes";
import ErrorBoundary from "../components/ErrorBoundary";

export default function AppRoutes() {
  const routes = useRoutes([
    // Public Routes
    {
      path: "/",
      element: (
        <ErrorBoundary>
          <LandingPage />
        </ErrorBoundary>
      ),
    },
    // Signup route - not wrapped in PublicRoute to allow resuming incomplete signup
    {
      path: "/signup",
      element: <SignUpPage />,
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "/otp-verification",
      element: (
        <PublicRoute>
          <OTPVerificationPage />
        </PublicRoute>
      ),
    },
    {
      path: "/login-otp-verification",
      element: (
        <PublicRoute>
          <OTPVerificationPage />
        </PublicRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      ),
    },
    {
      path: "/check-mail",
      element: (
        <PublicRoute>
          <CheckMail />
        </PublicRoute>
      ),
    },
    {
      path: "/change-password",
      element: (
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      ),
    },

    // Private Routes - Change Password (for logged-in users)
    {
      path: "/settings/change-password",
      element: (
        <PrivateRoute>
          <ChangePasswordPage />
        </PrivateRoute>
      ),
    },

    // Dashboard
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // My Jobs
    {
      path: "/my-jobs",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <MyJobs />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // My Services
    {
      path: "/services-offered",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <ServicesOffered />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },
    {
      path: "/services-offered/add-new-service",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <AddEditServicePage />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },
    {
      path: "/services-offered/edit/:id",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <AddEditServicePage />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // Earnings
    {
      path: "/earnings",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <Earnings />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // My Profile
    {
      path: "/my-profile",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <MyProfile />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },
    {
      path: "/my-profile/:id",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <EditProfile />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // Email and SMS
    {
      path: "/email-and-sms",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <Notifications />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // Backward compatible route (old path)
    {
      path: "/notifications",
      element: <Navigate to="/email-and-sms" replace />,
    },

    // Subscription Services (Renamed from Manage Subscription)
    {
      path: "/subscription-services",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <ManageSubscription />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // Privacy Policy
    {
      path: "/privacy-policy",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <PrivacyPolicy />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // Terms & Conditions
    {
      path: "/terms-and-conditions",
      element: (
        <PrivateRoute>
          <ErrorBoundary>
            <TermsAndConditions />
          </ErrorBoundary>
        </PrivateRoute>
      ),
    },

    // Landing Page
    {
      path: "/landing-page",
      element: (
        <ErrorBoundary>
          <LandingPage />
        </ErrorBoundary>
      ),
    },

    // Client Page (Public - accessed by username)
    // This must be at the end to avoid catching other routes
    {
      path: "/:username",
      element: (
        <ErrorBoundary>
          <ClientPage />
        </ErrorBoundary>
      ),
    },
  ]);

  return routes;
}
