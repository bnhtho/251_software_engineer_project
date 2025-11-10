import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  BarChart2,
  MessageSquare,
  Settings,
  Menu,
  LogOut,
  ArrowLeft,
  Search,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import Avatar from "../../Components/Avatar";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: Users, label: "Người dùng", to: "/admin/users" },
  { icon: BookOpen, label: "Khóa học", to: "/admin/courses" },
  { icon: CalendarCheck, label: "Buổi học", to: "/admin/sessions" },
  { icon: BarChart2, label: "Báo cáo", to: "/admin/reports" },
  { icon: MessageSquare, label: "Phản hồi", to: "/admin/feedback" },
  { icon: Settings, label: "Cài đặt", to: "/admin/settings" },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r border-gray-200 shadow-sm transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-500 text-white font-semibold">
            HM
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">HCMUT Admin</p>
            <p className="text-xs text-gray-500">Tutor/Mentor</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                ].join(" ")
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-gray-200 px-4 py-4">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
            Về trang User
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
          <button
            className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden flex-1 items-center md:flex">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng, khóa học..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name ?? "Admin"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role ?? "admin"}
              </p>
            </div>
            <Avatar name={user?.name ?? "Admin"} className="h-10 w-10" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

