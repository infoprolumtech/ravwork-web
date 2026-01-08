import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAppSelector } from "../rtk/store";
import type { RootState } from "../rtk/store";

interface PublicRouteProps {
  children: JSX.Element;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const isLogin = useAppSelector((state: RootState) => state.auth.isLogin);

  // If logged in, redirect to dashboard
  if (isLogin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
