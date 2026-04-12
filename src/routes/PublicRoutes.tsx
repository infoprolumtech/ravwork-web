import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";
import { useAppSelector } from "../rtk/store";
import type { RootState } from "../rtk/store";

interface PublicRouteProps {
  children: JSX.Element;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const isLogin = useAppSelector((state: RootState) => state.auth.isLogin);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  // If logged in, check if signup flow is complete
  if (isLogin) {
    const profileStep = user?.profileStep || 0;

    // If signup is incomplete (profileStep < 3), allow access to these pages
    // to continue the signup flow or allow login page to navigate
    // profileStep 3 = signup complete
    const allowedPaths = ["/", "/setup", "/login", "/landing"];
    if (profileStep < 3 && allowedPaths.includes(location.pathname)) {
      // For login page, redirect to signup to continue the flow
      if (location.pathname === "/login") {
        return (
          <Navigate
            to="/setup"
            state={{ resumeStep: profileStep + 1 }}
            replace
          />
        );
      }
      return children;
    }

    // Allow landing page for all logged-in users
    if (location.pathname === "/landing") {
      return children;
    }

    // Simple redirect to dashboard for any other public route attempt if logged in
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
