import { useRoutes } from "react-router-dom";

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
import Earnings from "../pages/earnings";
import MyProfile from "../pages/my-profile";
import Notifications from "../pages/notifications";
import ManageSubscription from "../pages/manage-subscription";
import EditProfile from "../pages/my-profile/[id]";
import ClientPage from "../pages/client";

import PublicRoute from "./PublicRoutes";
import PrivateRoute from "./PrivateRoutes";

export default function AppRoutes() {
  const routes = useRoutes([
    // Public Routes
    {
      path: "/",
      element: (
        <PublicRoute>
          <SignUpPage />
        </PublicRoute>
      ),
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

    // Client Page (No Layout)
    {
      path: "/ravwork.link/client",
      element: <ClientPage />,
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
          <Dashboard />
        </PrivateRoute>
      ),
    },

    // My Jobs
    {
      path: "/my-jobs",
      element: (
        <PrivateRoute>
          <MyJobs />
        </PrivateRoute>
      ),
    },

    // Services Offered
    {
      path: "/services-offered",
      element: (
        <PrivateRoute>
          <ServicesOffered />
        </PrivateRoute>
      ),
    },

    // Earnings
    {
      path: "/earnings",
      element: (
        <PrivateRoute>
          <Earnings />
        </PrivateRoute>
      ),
    },

    // My Profile
    {
      path: "/my-profile",
      element: (
        <PrivateRoute>
          <MyProfile />
        </PrivateRoute>
      ),
    },
    {
  path: "/my-profile/:id",
  element: (
    <PrivateRoute>
      <EditProfile />
    </PrivateRoute>
  ),
},

    // Notifications
    {
      path: "/notifications",
      element: (
        <PrivateRoute>
          <Notifications />
        </PrivateRoute>
      ),
    },

    // Manage Subscription
    {
      path: "/manage-subscription",
      element: (
        <PrivateRoute>
          <ManageSubscription />
        </PrivateRoute>
      ),
    },
  ]);

  return routes;
}
