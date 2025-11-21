import { useUser } from "../Context/UserContext";
import { useState } from "react";
import { Menu, X, Search, LayoutDashboard } from "lucide-react";
import hcmutLogo from '/src/assets/logo.svg';
import Avatar from "./Avatar";
export default function Header() {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;
  // Function to close the menu
  const closeMobileMenu = () => {
      setMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Danh sách khóa học", href: "#", requiresAdmin: false },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Logo and Search (Left Side) */}
          <div className="flex flex-1 items-center justify-start gap-4">
            <div className="flex shrink-0 items-center">
              <a href={isLoggedIn ? "/dashboard" : "/login"} className="text-xl font-bold text-[#0E7AA0] hover:text-blue-700 transition-colors">
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
              {/* Dashboard Admin link - chỉ hiển thị cho admin */}
              {isAdmin && (
                <a
                  href="/admin"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Về Dashboard Admin
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

            {/* Dashboard Admin link for Mobile - chỉ hiển thị cho admin */}
            {isAdmin && (
                <a
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Về Dashboard Admin
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

            {/* User info for Mobile */}
            {isLoggedIn && (
                <div className="rounded-md px-3 py-2 text-base font-medium text-gray-700 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Avatar 
                            name={user?.firstName ?? ""} 
                            className="h-8 w-8 rounded-full" 
                        />
                        <span>{user.lastName}</span>
                    </div>
                </div>
            )}
        </div>
      )}
    </nav>
  );
}