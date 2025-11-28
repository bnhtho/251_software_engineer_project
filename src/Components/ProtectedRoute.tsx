import { Navigate } from "react-router-dom";
import React from "react";
import { useUser } from "../Context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireTutor?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireTutor = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useUser();

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  // console.log(user?.role)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/login" replace />; // Chuyển hướng tới trang "Không có quyền truy cập"
  }

  if (requireTutor && user.role !== "tutor") {
    return <Navigate to="/login" replace />; // Chuyển hướng tới trang "Không có quyền truy cập"
  }

  return <>{children}</>;
};

export default ProtectedRoute;
