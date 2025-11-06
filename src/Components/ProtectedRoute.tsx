import { Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useUser } from "../Context/UserContext"; // Đảm bảo đường dẫn đúng

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useUser(); 
  const location = useLocation();
  const navigate = useNavigate();

  // 🚀 LOGIC REDIRECT: CHUYỂN HOOK LÊN TRÊN CÁC CÂU LỆNH RETURN ĐIỀU KIỆN
  // Hook này phải luôn được gọi trong mọi render
  useEffect(() => {
    const lastPath = localStorage.getItem("lastPath");
    
    // Nếu có path cũ VÀ người dùng đang cố truy cập Route cha (/dashboard)
    if (lastPath && location.pathname === "/dashboard") {
      // Tránh redirect nếu lastPath cũng là /dashboard
      if (lastPath !== "/dashboard") { 
          navigate(lastPath, { replace: true });
      }
    }
  }, [user, location.pathname, navigate]); 
  // Dependency [user] giúp trigger lại khi trạng thái login thay đổi
  // 1. Nếu ĐANG TẢI, HIỂN THỊ MÀN HÌNH CHỜ
  if (isLoading) {
    return <div>Loading session...</div>; 
  }

  // 2. Nếu đã tải xong nhưng KHÔNG CÓ USER, redirect về login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra quyền Admin (nếu cần)
  if (requireAdmin && user.role !== "admin") {
    // Redirect về trang chủ nếu không có quyền Admin
    return <Navigate to="/dashboard" replace />; 
  }

  // 4. Cho phép truy cập
  return <>{children}</>;
};

export default ProtectedRoute;