import { useUser } from "../Context/UserContext";
// Load navbar
export default function Header() {
  const { user, logout } = useUser();
  let userSection;
  let userRole;

    if (user) {
      userSection = (
      "Đăng xuất"
      )
    } else{
      userSection = (
        "Chưa đăng nhập"
      );
    }
    // User Role: Hide Dashboard link if not admin
    if(user?.role === "admin"){
      userRole = "admin";
    } else {
      userRole = "user";
    }
    // Handle logout
    const handleLogout = () => {
      logout();
      window.location.href = "/";
    }
  return (
    // Fix : In HTML, <a> cannot be a descendant of <a>.
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm gia sư, buổi học..."
            className="max-w-sm px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-100"
          />
        </div>
        
        <nav className="flex items-center gap-8">
  {userRole === "admin" && (
    <a href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
      Dashboard
    </a>
  )}

  <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
    Khóa học
  </a>

  <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
    Đăng ký Gia sư
  </a>

  {userRole === "admin" && (
    <a href="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
      Quản trị
    </a>
  )}

  {user ? (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
    >
      Đăng xuất ({user.name})
    </button>
  ) : (
    <a href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
      Đăng nhập
    </a>
  )}
</nav>

      </div>
    </header>
  )
}
