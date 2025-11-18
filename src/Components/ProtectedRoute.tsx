import { Navigate } from "react-router-dom";
import React from "react";
import { useUser } from "../Context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useUser();

  // 1️⃣ Nếu đang load user
  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  // 2️⃣ Nếu chưa login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Nếu route admin mà user không phải admin
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />; 
  }

  // 4️⃣ Cho phép truy cập
  return <>{children}</>;
};

export default ProtectedRoute;
