import { lazy, Suspense } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import SuspenseLoader from "../components/SuspenseLoader";

// Auth & Common Pages
const LoginPage = lazy(() => import("../pages/login"));
const SignUpPage = lazy(() => import("../pages/signup"));
const ForgotPassword = lazy(() => import("../pages/forgot-password"));
const CheckMail = lazy(() => import("../pages/check-mail"));
const ResetPasswordPage = lazy(() => import("../pages/reset-password"));
const ChangePasswordPage = lazy(() => import("../pages/change-password"));
const OTPVerificationPage = lazy(() => import("../pages/otp-verification"));

// Main App Pages (7 menu items)
const Dashboard = lazy(() => import("../pages/dashboard"));
const MyJobs = lazy(() => import("../pages/my-jobs"));
const ServicesOffered = lazy(() => import("../pages/services-offered"));
const AddEditServicePage = lazy(
  () => import("../pages/services-offered/add-edit"),
);
const Earnings = lazy(() => import("../pages/earnings"));
const MyProfile = lazy(() => import("../pages/my-profile"));
const Notifications = lazy(() => import("../pages/notifications"));
const ManageSubscription = lazy(() => import("../pages/subscription-services"));
const EditProfile = lazy(() => import("../pages/my-profile/[id]"));
const ClientPage = lazy(() => import("../pages/client"));
const LandingPage = lazy(() => import("../pages/landing-page"));
const PrivacyPolicy = lazy(() => import("../pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("../pages/terms-and-conditions"));
const TryDemo = lazy(() => import("../pages/try-demo"));
const SetupPage = lazy(() => import("../pages/setup"));
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

    // Try Demo
    {
      path: "/try-demo",
      element: (
        <ErrorBoundary>
          <TryDemo />
        </ErrorBoundary>
      ),
    },
    // Setup Page

    {
      path: "/setup",
      element: (
        <ErrorBoundary>
          <SetupPage />
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

  return <Suspense fallback={<SuspenseLoader />}>{routes}</Suspense>;
}
