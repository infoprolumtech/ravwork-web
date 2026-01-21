import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAppSelector } from "../rtk/store";
import type { RootState } from "../rtk/store";
import { calculateProfileComplete } from "../utils/helper";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: JSX.Element;
}

export default function PrivateRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const isLogin = useAppSelector((state: RootState) => state.auth.isLogin);
  const user = useAppSelector((state: RootState) => state.auth.user);

  // Not logged in → redirect to login
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role is not allowed → redirect to dashboard
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    const completion = calculateProfileComplete(
      {
        displayName: user?.displayName ?? "",
        profilePhoto: user?.profilePhoto ?? "",
        businessDescription: user?.businessDescription ?? "",
      },
      false
    );
    return <Navigate to={completion >= 50 ? "/services-offered" : "/my-profile"} replace />;
  }

  return children;
}
