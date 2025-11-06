import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React, { useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🧠 Lưu path hiện tại mỗi khi người dùng thay đổi route
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location]);

  // 🚀 Khi app mount lần đầu (sau khi reload / reopen tab)
  useEffect(() => {
    const lastPath = localStorage.getItem("lastPath");
    if (lastPath && location.pathname === "/dashboard") {
      navigate(lastPath, { replace: true });
    }
  }, []); // chỉ chạy 1 lần khi mount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-4rem)]">
          <div className="col-span-12 md:col-span-3 lg:col-span-2 hidden md:block">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-lg shadow-sm border border-gray-200">
              <Sidebar />
            </div>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;