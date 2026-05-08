import { Navigate } from "react-router-dom";
import { useApp, Role } from "@/store/app";

export const Protected = ({ children, roles }: { children: JSX.Element; roles?: Role[] }) => {
  const user = useApp((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};
