import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  Users,
  RefreshCw,
} from "lucide-react";

const mockNavigate = (path: string) => {
  console.log(`[MOCK NAVIGATION] Navigating to: ${path}`);
};
const mockToast = {
  success: (message: string) => console.log(`[MOCK TOAST SUCCESS]: ${message}`),
  error: (message: string) => console.error(`[MOCK TOAST ERROR]: ${message}`),
};
// --- MOCK DEPENDENCIES END ---

interface Session {
  id: number;
  subjectName: string;
  subjectId: number;
  startTime: string;
  endTime: string;
  format: "ONLINE" | "OFFLINE";
  location: string;
  maxQuantity: number;
  currentQuantity: number;
  status: "OPEN" | "CLOSED" | "FULL" | "CANCELLED";
  studentNames: string[];
}

const mockSessionsData: Session[] = [
  {
    id: 101,
    subjectName: "Giải tích 1 (Calculus I)",
    subjectId: 1,
    startTime: "2025-12-05T19:00:00Z",
    endTime: "2025-12-05T21:00:00Z",
    format: "ONLINE",
    location: "Google Meet Link",
    maxQuantity: 20,
    currentQuantity: 18,
    status: "OPEN",
    studentNames: ["Nguyen A", "Tran B"],
  },
  {
    id: 102,
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    subjectId: 2,
    startTime: "2025-12-08T14:30:00Z",
    endTime: "2025-12-08T16:00:00Z",
    format: "OFFLINE",
    location: "Phòng A301, Đại học Bách Khoa",
    maxQuantity: 10,
    currentQuantity: 10,
    status: "FULL",
    studentNames: ["Le C", "Pham D"],
  },
  {
    id: 103,
    subjectName: "Lập trình Web Frontend (React)",
    subjectId: 3,
    startTime: "2025-12-10T10:00:00Z",
    endTime: "2025-12-10T12:00:00Z",
    format: "ONLINE",
    location: "Zoom ID: 876-543-210",
    maxQuantity: 15,
    currentQuantity: 5,
    status: "OPEN",
    studentNames: ["Hoang E"],
  },
  {
    id: 104,
    subjectName: "Cơ sở dữ liệu (SQL)",
    subjectId: 4,
    startTime: "2025-12-01T08:00:00Z",
    endTime: "2025-12-01T09:30:00Z",
    format: "OFFLINE",
    location: "Thư viện Quận 1, Tầng 3",
    maxQuantity: 8,
    currentQuantity: 8,
    status: "CLOSED", // Giả lập đã qua thời gian hoặc đã đóng thủ công
    studentNames: ["Bui F", "Do G"],
  },
  {
    id: 105,
    subjectName: "Vật lý Đại cương 2",
    subjectId: 5,
    startTime: "2025-12-15T17:00:00Z",
    endTime: "2025-12-15T18:30:00Z",
    format: "ONLINE",
    location: "Microsoft Teams",
    maxQuantity: 12,
    currentQuantity: 0,
    status: "CANCELLED",
    studentNames: [],
  },
];

const TutorSessions: React.FC = () => {
  // Thay thế useUser, useNavigate, axios, toast bằng các giá trị/hàm mock
  const navigate = mockNavigate;
  const toast = mockToast;

  const [loading, setLoading] = useState(false); // Giảm bớt loading ban đầu
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [formatFilter, setFormatFilter] = useState<string>("ALL");
  // ------------------- Modal Call
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const loadSessions = async () => {
    setLoading(true);
    console.log("[MOCK API] Loading sessions...");
    // Giả lập độ trễ 1 giây cho API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // ** FIX: Đảm bảo dữ liệu trả về luôn là một mảng **
      // Trong trường hợp này, ta dùng dữ liệu mock.
      const listSession: Session[] = mockSessionsData;
      setSessions(listSession);
      mockToast.success("Đã tải danh sách buổi học");
    } catch (error) {
      console.error("Error loading sessions:", error);
      mockToast.error("Không thể tải danh sách buổi học (Mock Error)");
      // Quan trọng: Đảm bảo sessions vẫn là mảng rỗng nếu lỗi
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []); // Tải dữ liệu mẫu khi component mount

  const handleDelete = (sessionId: number) => {
    // Thay thế confirm() bằng modal/confirm box
    if (!window.confirm("Bạn có chắc muốn xóa buổi học này? (Sử dụng Modal/Custom Confirm trong thực tế)")) return;

    try {
      // Giả lập xóa thành công
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success("Đã xóa buổi học thành công (Mock)");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Không thể xóa buổi học (Mock Error)");
    }
  };

  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      // Kiểm tra nếu date là Invalid Date
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      // Kiểm tra nếu date là Invalid Date
      if (isNaN(date.getTime())) return '';

      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return '';
    }
  };

  // Sử dụng useMemo để tối ưu hóa việc lọc dữ liệu và sửa lỗi Type Error
  const filteredSessions = useMemo(() => {
    // ** FIX: Sử dụng sessions?.filter để đảm bảo nó là mảng (optional chaining) 
    // Mặc dù ta đã khởi tạo nó là [], dùng optional chaining là tốt nhất.
    return sessions?.filter((session) => {
      const matchesSearch =
        searchTerm === "" ||
        session.subjectName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || session.status === statusFilter;

      const matchesFormat =
        formatFilter === "ALL" || session.format === formatFilter;

      return matchesSearch && matchesStatus && matchesFormat;
    }) ?? []; // Default to empty array if sessions is null/undefined
  }, [sessions, searchTerm, statusFilter, formatFilter]);

  const totalSessions = sessions.length;
  const openSessions = sessions.filter(s => s.status === "OPEN").length;
  const fullSessions = sessions.filter(s => s.status === "FULL").length;
  const totalStudents = sessions.reduce((sum, s) => sum + s.currentQuantity, 0);

  if (loading && totalSessions === 0) {
    return (
      <div className="flex items-center justify-center min-h-64 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Quản lý Buổi học
            </h1>
            <p className="mt-1 text-gray-600">
              Tạo, chỉnh sửa và quản lý các buổi học đã lên lịch của bạn
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadSessions}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <button onClick={openModal}>Open Modal</button>

          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="lg:col-span-6">
            <label htmlFor="search" className="sr-only">Tìm kiếm theo môn học</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Tìm kiếm theo môn học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label htmlFor="statusFilter" className="sr-only">Lọc theo trạng thái</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="OPEN">Đang mở</option>
                <option value="FULL">Đã đầy</option>
                <option value="CLOSED">Đã đóng</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-3">
            <label htmlFor="formatFilter" className="sr-only">Lọc theo hình thức</label>
            <div className="relative">
              <Laptop className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                id="formatFilter"
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="ALL">Tất cả hình thức</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Tổng buổi học" value={totalSessions} color="text-gray-900" icon={<Calendar className="h-6 w-6 text-indigo-500" />} />
          <StatCard title="Đang mở" value={openSessions} color="text-green-600" icon={<Clock className="h-6 w-6 text-green-500" />} />
          <StatCard title="Đã đầy" value={fullSessions} color="text-orange-600" icon={<Users className="h-6 w-6 text-orange-500" />} />
          <StatCard title="Tổng sinh viên" value={totalStudents} color="text-blue-600" icon={<Users className="h-6 w-6 text-blue-500" />} />
        </div>

        {/* Sessions List */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Không tìm thấy buổi học nào
              </h3>
              <p className="mt-2 text-gray-500">
                Thử thay đổi bộ lọc hoặc tạo buổi học mới.
              </p>
              <button
                onClick={() => navigate("/tutor/sessions/new")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Tạo buổi học mới
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader title="Môn học" />
                    <TableHeader title="Thời gian" />
                    <TableHeader title="Hình thức" />
                    <TableHeader title="Địa điểm" />
                    <TableHeader title="Số lượng" />
                    <TableHeader title="Trạng thái" />
                    <TableHeader title="Thao tác" align="text-right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 max-w-xs truncate">
                        <div className="font-semibold text-gray-900">
                          {session.subjectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <Calendar className="h-3 w-3 inline mr-1 text-gray-500" /> {formatDateTime(session.startTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" /> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <FormatBadge format={session.format} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-[150px] truncate" title={session.location}>
                          {session.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className={`${session.currentQuantity === session.maxQuantity ? 'text-red-600 font-bold' : ''}`}>
                            {session.currentQuantity}
                          </span>
                          /{session.maxQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={session.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => navigate(`/tutor/sessions/${session.id}`)}
                            className="text-blue-600 hover:text-blue-800 transition p-1 rounded-full hover:bg-blue-50"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="text-red-600 hover:text-red-800 transition p-1 rounded-full hover:bg-red-50"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatusBadge: React.FC<{ status: Session['status'] }> = ({ status }) => {
  const statusMap = {
    OPEN: { text: "Đang mở", bg: "bg-green-100", color: "text-green-800" },
    FULL: { text: "Đã đầy", bg: "bg-orange-100", color: "text-orange-800" },
    CLOSED: { text: "Đã đóng", bg: "bg-gray-100", color: "text-gray-800" },
    CANCELLED: { text: "Đã hủy", bg: "bg-red-100", color: "text-red-800" },
  };
  const { text, bg, color } = statusMap[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${bg} ${color}`}
    >
      {text}
    </span>
  );
};

const FormatBadge: React.FC<{ format: Session['format'] }> = ({ format }) => {
  const isOnline = format === "ONLINE";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${isOnline
        ? "bg-indigo-100 text-indigo-700"
        : "bg-teal-100 text-teal-700"
        }`}
    >
      {isOnline ? (
        <><Laptop className="h-3 w-3" /> Online</>
      ) : (
        <><MapPin className="h-3 w-3" /> Offline</>
      )}
    </span>
  );
};

const StatCard: React.FC<{ title: string; value: number; color: string; icon: React.ReactNode }> = ({ title, value, color, icon }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>
        {value}
      </p>
    </div>
    <div className="p-3 bg-gray-100 rounded-full">
      {icon}
    </div>
  </div>
);

const TableHeader: React.FC<{ title: string; align?: string }> = ({ title, align = "text-left" }) => (
  <th className={`px-6 py-3 ${align} text-xs font-semibold uppercase tracking-wider text-gray-500`}>
    {title}
  </th>
);

export default TutorSessions;