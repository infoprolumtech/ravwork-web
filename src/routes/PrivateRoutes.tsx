// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { JSX } from "react";

// export default function PrivateRoute({ children }: { children: JSX.Element }) {
//   const isLogin = useSelector((state: any) => state.auth.isLogin);
//   return isLogin ? children : <Navigate to="/" replace />;
// }
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { JSX } from "react";

type ProtectedRouteProps = {
  allowedRoles?: string[];
  children: JSX.Element;
};

export default function PrivateRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const isLogin = useSelector((state: any) => state.auth.isLogin);
  const user = useSelector((state: any) => state.auth.user);

  // Not logged in → redirect to login
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role is not allowed → redirect to dashboard
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
