import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
};

export default function PublicRoute({ children }: Props) {
  const isLogin = useSelector((state: any) => state.auth.isLogin);

  // If logged in, redirect to a suitable page based on role
  if (isLogin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
