import {useUser} from "../Context/UserContext";
import { NavLink } from "react-router-dom";
import { useState } from "react";
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
  // Mobile Reponsive
  const [isOpen, setIsOpen] = useState(false); // mobile toggle

  return (
              <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:block
        `}
      >
          <button
      className="md:hidden p-2 rounded-md hover:bg-gray-100"
      onClick={() => setIsOpen(!isOpen)}
    >
      <Menu className="w-6 h-6" />
    </button>
      
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
                  ? "text-[#0E7AA0]"
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
