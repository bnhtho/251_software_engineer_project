export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm gia sư, buổi học..."
            className="max-w-sm px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-100"
          />
        </div>
        <nav className="flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Khóa học
          </a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Đăng ký Gia sư
          </a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Quản trị
          </a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Đăng nhập
          </a>
        </nav>
      </div>
    </header>
  )
}
