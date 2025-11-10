import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  UserCheck,
  Mail,
  Phone
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Sinh viên' | 'Gia sư' | 'Điều phối viên' | 'Quản lý';
  status: 'active' | 'inactive';
  joinDate: string;
}

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('users');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sidebar menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'users', label: 'Người dùng', icon: Users, path: '/dashboard/users' },
    { id: 'courses', label: 'Khóa học', icon: BookOpen, path: '/dashboard/courses' },
    { id: 'sessions', label: 'Buổi học', icon: Calendar, path: '/dashboard/schedule' },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3, path: '/dashboard/reports' },
    { id: 'feedback', label: 'Phản hồi', icon: MessageSquare, path: '/dashboard/feedback' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/dashboard/settings' },
  ];

  // Sample users
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Nguyễn Văn An', email: 'an.nguyen@hcmut.edu.vn', phone: '0901234567', role: 'Sinh viên', status: 'active', joinDate: '01/09/2024' },
    { id: 2, name: 'Trần Thị Hương', email: 'huong.tran@hcmut.edu.vn', phone: '0902345678', role: 'Gia sư', status: 'active', joinDate: '15/08/2024' },
    { id: 3, name: 'Lê Văn Tuấn', email: 'tuan.le@hcmut.edu.vn', phone: '0903456789', role: 'Gia sư', status: 'active', joinDate: '10/08/2024' },
    { id: 4, name: 'Phạm Thị Lan', email: 'lan.pham@hcmut.edu.vn', phone: '0904567890', role: 'Điều phối viên', status: 'active', joinDate: '01/07/2024' },
    { id: 5, name: 'Hoàng Minh Tuấn', email: 'tuan.hoang@hcmut.edu.vn', phone: '0905678901', role: 'Sinh viên', status: 'inactive', joinDate: '20/09/2024' },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const studentsCount = users.filter(u => u.role === 'Sinh viên').length;
  const tutorsCount = users.filter(u => u.role === 'Gia sư').length;

  const handleLogout = () => {
    navigate('/login');
  };

  const handleMenuClick = (item: typeof menuItems[number]) => {
    setCurrentPage(item.id);
    navigate(item.path);
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full overflow-y-auto">
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
                      isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
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

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quản lý người dùng</h2>
              <p className="text-sm text-gray-600 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm người dùng
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg"><Users className="h-5 w-5 text-white" /></div>
              <div>
                <p className="text-sm text-gray-500">Tổng người dùng</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-lg"><UserCheck className="h-5 w-5 text-white" /></div>
              <div>
                <p className="text-sm text-gray-500">Đang hoạt động</p>
                <h3 className="text-2xl font-bold text-gray-900">{activeUsers}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-3 rounded-lg"><Users className="h-5 w-5 text-white" /></div>
              <div>
                <p className="text-sm text-gray-500">Sinh viên</p>
                <h3 className="text-2xl font-bold text-gray-900">{studentsCount}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-lg"><Users className="h-5 w-5 text-white" /></div>
              <div>
                <p className="text-sm text-gray-500">Gia sư</p>
                <h3 className="text-2xl font-bold text-gray-900">{tutorsCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="p-6 bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tên</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Vai trò</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Trạng thái</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Ngày tham gia</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-600">#{user.id}</td>
                  <td className="px-5 py-4">{user.name}</td>
                  <td className="px-5 py-4">{user.email}</td>
                  <td className="px-5 py-4">{user.role}</td>
                  <td className="px-5 py-4">{user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td className="px-5 py-4">{user.joinDate}</td>
                  <td className="px-5 py-4 flex gap-2">
                    <button onClick={() => handleEditUser(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              {/* Form fields here... */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}