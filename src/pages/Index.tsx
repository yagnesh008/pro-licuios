import { Navigate } from "react-router-dom";
import { useApp } from "@/store/app";

const Index = () => {
  const user = useApp((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "vendor") return <Navigate to="/vendor" replace />;
  if (user.role === "delivery") return <Navigate to="/delivery" replace />;
  return <Navigate to="/marketplace" replace />;
};

export default Index;
