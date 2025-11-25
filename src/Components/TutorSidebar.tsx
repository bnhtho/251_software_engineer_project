import { NavLink } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { useState, useEffect, useRef } from "react";
import {
  Home,
  BookOpen,
  Calendar,
  FileText,
  Bell,
  User,
  UserCircle,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import React from "react";
import Avatar from "./Avatar";

type NavItemType = {
  label: string;
  path: string;
  icon: React.ElementType;
  isFooter?: boolean;
};

type NavItemDividerType = {
  divider: true;
};

export default function TutorSidebar() {
  const { user, logout } = useUser();
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  const mainNavItems: (NavItemType | NavItemDividerType)[] = [
    { icon: Home, label: "Dashboard", path: "" },
    { icon: BookOpen, label: "Quản lý buổi học", path: "sessions" },
    { icon: ClipboardList, label: "Đăng ký sinh viên", path: "registrations" },
    { icon: Calendar, label: "Lịch dạy", path: "schedule" },
    { icon: FileText, label: "Tài liệu", path: "materials" },
    { divider: true },
  ];

  const bottomItems: NavItemType[] = [
    { icon: Bell, label: "Thông báo", path: "notifications", isFooter: true },
  ];

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render navigation item
  const renderNavItem = (item: NavItemType, key: number) => {
    if (item.isFooter) {
      return (
        <button
          key={key}
          onClick={() => {
            /* Handle footer click */
          }}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </button>
      );
    }

    // Build path for tutor routes
    const toPath = item.path === "" ? "/tutor" : `/tutor/${item.path}`;

    return (
      <NavLink
        key={key}
        to={toPath}
        end={item.path === ""}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
            isActive
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-100 transition-colors"
          }`
        }
      >
        <item.icon className="h-5 w-5" />
        <span>{item.label}</span>
        <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
      </NavLink>
    );
  };

  return (
    <aside className="flex flex-col h-full w-full bg-white border-r border-gray-200">
      {/* Main Navigation */}
      <nav className="space-y-1 px-2 py-4 overflow-y-auto grow">
        {mainNavItems.map((item, idx) => {
          if ("divider" in item) {
            return <hr key={idx} className="my-2 border-gray-200" />;
          }
          return renderNavItem(item as NavItemType, idx);
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="w-full border-t border-gray-200 bg-white px-2 py-4 space-y-1 shrink-0">
        {bottomItems.map((item, idx) =>
          renderNavItem(item, idx + mainNavItems.length)
        )}

        {/* Account Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <User className="h-5 w-5" />
            <span>Tài khoản</span>
            <ChevronDown
              className={`ml-auto h-4 w-4 transition-transform ${
                accountDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {accountDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={`${user?.firstName} ${user?.lastName}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {name || ""}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      Gia sư
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <NavLink
                  to="/tutor/profile"
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Thông tin cá nhân</span>
                </NavLink>

                <NavLink
                  to="/tutor/settings"
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Cài đặt</span>
                </NavLink>

                <hr className="my-1 border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
