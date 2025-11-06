import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user } = useUser();
  const location = useLocation();

  // Nếu chưa đăng nhập, redirect về login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu yêu cầu admin nhưng user không phải admin
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
