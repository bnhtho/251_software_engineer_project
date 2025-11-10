import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Activity,
  TrendingUp,
  UserCheck,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';

export function SimpleDashboardPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'users', label: 'Người dùng', icon: Users, path: '/dashboard/users' },
    { id: 'courses', label: 'Khóa học', icon: BookOpen, path: '/dashboard/courses' },
    { id: 'sessions', label: 'Buổi học', icon: Calendar, path: '/dashboard/schedule' },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3, path: '/dashboard/reports' },
    { id: 'feedback', label: 'Phản hồi', icon: MessageSquare, path: '/dashboard/feedback' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/dashboard/settings' },
  ];

  // Sample stats
  const stats = [
    { title: 'Tổng người dùng', value: '420', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { title: 'Hoạt động', value: '1,750', change: '+8%', icon: Activity, color: 'bg-green-500' },
    { title: 'Tăng trưởng', value: '23%', change: '+3%', icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Đang hoạt động', value: '156', change: '+5%', icon: UserCheck, color: 'bg-orange-500' },
  ];

  const users = [
    { id: 1, name: 'Nguyễn Văn An', email: 'an.nguyen@hcmut.edu.vn', role: 'Sinh viên', status: 'active' },
    { id: 2, name: 'Trần Thị Hương', email: 'huong.tran@hcmut.edu.vn', role: 'Gia sư', status: 'active' },
    { id: 3, name: 'Lê Văn Tuấn', email: 'tuan.le@hcmut.edu.vn', role: 'Gia sư', status: 'active' },
    { id: 4, name: 'Phạm Thị Lan', email: 'lan.pham@hcmut.edu.vn', role: 'Điều phối viên', status: 'active' },
    { id: 5, name: 'Hoàng Minh Tuấn', email: 'tuan.hoang@hcmut.edu.vn', role: 'Sinh viên', status: 'inactive' },
  ];

  const handleLogout = () => {
    // Xử lý logout, ví dụ clear token, redirect
    navigate('/login');
  };

  const handleMenuClick = (item: typeof menuItems[number]) => {
    setCurrentPage(item.id);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">HCMUT Admin</h1>
              <p className="text-xs text-gray-600">Tutor/Mentor</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 mb-2"
          >
            <Home className="w-5 h-5 text-gray-400" />
            <span>Về trang User</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-600 mt-1">Chào mừng trở lại, Admin</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-xs text-gray-600">{stat.title}</p>
                </div>
              );
            })}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Quản lý người dùng</h3>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Thêm mới</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tên</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Vai trò</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Trạng thái</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Thống kê người dùng</h3>
            <div className="space-y-3">
              {[
                { month: 'T6', value: 120, max: 420 },
                { month: 'T7', value: 165, max: 420 },
                { month: 'T8', value: 210, max: 420 },
                { month: 'T9', value: 280, max: 420 },
                { month: 'T10', value: 350, max: 420 },
                { month: 'T11', value: 420, max: 420 },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-xs text-gray-600 font-medium">{item.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-7 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
