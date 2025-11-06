import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Context/UserContext"; // Đảm bảo đường dẫn đúng

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user} = useUser(); 
  const location = useLocation();
  // NOTE: Nếu chưa đăng nhập (và đã xong quá trình loading), redirect về login . Khi user không được đăng nhập, nó tự động chuyển hướng sang login 
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu yêu cầu admin nhưng user không phải admin
  if (requireAdmin && user.role !== "admin") {
    // Có thể redirect về trang 403 (Access Denied) thay vì login nếu đã đăng nhập
    return <Navigate to="/" replace />; // Hoặc về trang chủ
  }

  // Đã đăng nhập và có quyền truy cập
  return <>{children}</>;
};

export default ProtectedRoute;