import { NavLink, useParams } from "react-router-dom";
import {useUser} from "../Context/UserContext";

import { ChevronRight, Home, Users, BookOpen, FileText, Settings, Bell, User, Menu } from "lucide-react"
const menuItems = [
  { icon: Home, label: "Trang chủ", path: "" },
  { icon: Users, label: "Thông tin cá nhân", path: "profile" },
  { icon: BookOpen, label: "Lịch học", path: "schedule" },
  { icon: FileText, label: "Khóa học", path: "courses" },
  { icon: Users, label: "Danh sách Gia sư", path: "tutors" },
  { icon: FileText, label: "Phản hồi", path: "feedback" },
  { icon: Menu, label: "Báo cáo", path: "reports" },
  { icon: Settings, label: "Cài đặt", path: "settings" },
];

export default function Sidebar() {
  const {user} = useUser();
  return (
    <aside className="w-64 border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500 text-white font-bold text-sm">
          📚
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">HCMUT</p>
          <p className="text-xs text-gray-500">{user?.name}</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="space-y-1 px-2 py-4">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            // to={`/home/${user?.id}/${item.path}`}
            to={item.path === "" ? `/home/${user?.id}` : `/home/${user?.id}/${item.path}`}
            end={item.path === ""}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 transition-colors"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
          </NavLink>
        ))}   
      </nav>

      {/* Bottom Menu */}
      <div className="absolute bottom-0 w-44 border-t border-gray-200 bg-white px-2 py-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
          <User className="h-5 w-5" />
          <span>Account</span>
        </button>
      </div>
    </aside>
  )
}
