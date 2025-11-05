import { useUser } from "../Context/UserContext";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import hcmutLogo from '/src/assets/logo.svg';
import Avatar from "./Avatar";
export default function Header() {
  const { user, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  // Function to close the menu
  const closeMobileMenu = () => {
      setMobileMenuOpen(false);
  };

  // Define navigation items based on the old nav's links
  const navItems = [
    { name: "Khóa học", href: "#", requiresAdmin: false },
    { name: "Đăng ký Gia sư", href: "#", requiresAdmin: false },
    // Only include Admin/Quản trị link if the user is an admin
    ...(isAdmin ? [{ name: "Quản trị", href: "/admin", requiresAdmin: true }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Logo and Search (Left Side) */}
          <div className="flex flex-1 items-center justify-start gap-4">
            <div className="flex shrink-0 items-center">
              <a href="/" className="text-xl font-bold text-[#0E7AA0] hover:text-blue-700 transition-colors">
                <img
              className="w-12 h-12"
              alt="HCMUT Logo"
              src={hcmutLogo}
            />
              </a>
            </div>

            {/* Search Bar (Desktop only) */}
            <div className="hidden lg:block flex-1 max-w-sm relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm gia sư, buổi học..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Desktop Menu & User Actions (Right Side) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-8">
            <div className="flex space-x-6">
              {/* Dashboard link for Admin */}
              {isAdmin && (
                <a
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </a>
              )}
              {/* Navigation links */}
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* User Profile / Login/Logout */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Đăng xuất {user.name ? `(${user.name})` : ""}
                </button>
              ) : (
                <a 
                  href="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </a>
              )}
              {/* Avatar */}
              <div className="ml-3 relative">
                  <Avatar 
                      name={user?.name ?? ""} 
                      className="h-8 w-8 rounded-full" 
                  />
              </div>
              
            </div>
          </div>
          
          {/* Mobile menu button (Right Side on Mobile) */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 border-t border-gray-100">
            {/* Search Bar (Mobile) - Does not close menu */}
            <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Tìm kiếm gia sư, buổi học..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Dashboard link for Admin on Mobile */}
            {isAdmin && (
                <a
                    href="/dashboard"
                    onClick={closeMobileMenu} // Closes menu on click
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                    Dashboard
                </a>
            )}

            {/* Navigation links for Mobile */}
            {navItems.map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu} // Closes menu on click
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                    {item.name}
                </a>
            ))}

            {/* Login/Logout section for Mobile */}
            {isLoggedIn ? (
                <button
                    onClick={() => {handleLogout(); closeMobileMenu();}} // Closes menu AND logs out
                    className="w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                    Đăng xuất {user.name ? `(${user.name})` : ""}
                </button>
            ) : (
                <a
                    href="/login"
                    onClick={closeMobileMenu} // Closes menu on click
                    className="block rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
                >
                    Đăng nhập
                </a>
            )}
        </div>
      )}
    </nav>
  );
}