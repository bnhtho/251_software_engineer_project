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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SessionForm from "../../Components/SessionForm";
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { scheduleApi } from "../../services/api";

// --- MOCK DEPENDENCIES START ---
const mockNavigate = (path: string) => {
  console.log(`[MOCK NAVIGATION] Navigating to: ${path}`);
};

// --- MOCK DEPENDENCIES END ---

interface SessionDTO {
  id: number;
  tutorName: string;
  studentNames: string[];
  subjectName: string;
  startTime: string;
  endTime: string;
  format: string; // "ONLINE" or "OFFLINE"
  location: string;
  maxQuantity: number;
  currentQuantity: number;
  updatedDate: string;
  sessionStatus?: string; // Matches backend field
}

// --- FRAMER MOTION VARIANTS ---
const slideDownVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: "auto",
    opacity: 1,
  },
};

const TutorSessions: React.FC = () => {
  const navigate = mockNavigate;
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [formatFilter, setFormatFilter] = useState<string>("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const loadSessions = async (page: number = 0) => {
    try {
      // Gọi API riêng cho tutor
      const response = await scheduleApi.getTutorSessions(page);
      
      setSessions(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
      
      console.log("Đã tải danh sách buổi học của tutor:", response);
    } catch (error) {
      console.error("Không thể tải danh sách buổi học:", error);
      setSessions([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadSessions(0);
  }, []);

  const handleDelete = async (sessionId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa buổi học này?")) return;
    
    try {
      await scheduleApi.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      console.log("Xóa buổi học thành công");
    } catch (error) {
      console.error("Không thể xóa buổi học:", error);
      alert("Không thể xóa buổi học. Vui lòng thử lại.");
    }
  };

  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
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
      if (isNaN(date.getTime())) return '';

      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return '';
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        searchTerm === "" ||
        session.subjectName.toLowerCase().includes(searchTerm.toLowerCase());

        // Use proper sessionStatus field from backend
        const matchesStatus =
          statusFilter === "ALL" || session.sessionStatus === statusFilter;      const matchesFormat =
        formatFilter === "ALL" || session.format === formatFilter;

      return matchesSearch && matchesStatus && matchesFormat;
    });
  }, [sessions, searchTerm, statusFilter, formatFilter]);

  const totalSessions = sessions.length;
  // Use proper sessionStatus field for statistics
  const scheduledSessions = sessions.filter(s => s.sessionStatus === "SCHEDULED").length;
  const completedSessions = sessions.filter(s => s.sessionStatus === "COMPLETED").length;
  const totalStudents = sessions.reduce((sum, s) => sum + s.currentQuantity, 0);

  // --- TRẠNG THÁI LOADING BAN ĐẦU ---
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

        {/* KHU VỰC 1: HEADER & NÚT HÀNH ĐỘNG */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Tiêu đề */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Quản lý Buổi học
            </h1>
            <p className="mt-1 text-gray-600">
              Tạo, chỉnh sửa và quản lý các buổi học đã lên lịch của bạn
            </p>
          </div>

          {/* Nút Hành động */}
          <div className="flex gap-2">
            <button
              onClick={() => loadSessions(currentPage)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
              title="Làm mới danh sách"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>

            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center bg-blue-600 gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              type="button"
            >
              <Plus className="h-4 w-4" />
              {isDropdownOpen ? 'Huỷ' : 'Tạo buổi học mới'}
            </button>
          </div>
        </div>

        {/* KHU VỰC 2: DROPDOWN TẠO BUỔI HỌC (FRAMER MOTION) */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              key="create-session-dropdown"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideDownVariants}
              style={{ overflow: 'hidden' }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4"
            >
              {/*SECTION: components form */}
              <SessionForm />

              {/* </div> */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* KHU VỰC 3: BỘ LỌC (FILTERS) */}
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
                <option value="PENDING">Chờ xác nhận</option>
                <option value="SCHEDULED">Đã lên lịch</option>
                <option value="IN_PROGRESS">Đang diễn ra</option>
                <option value="COMPLETED">Hoàn thành</option>
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

        {/* KHU VỰC 4: THỐNG KÊ (STATISTICS) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Tổng buổi học" value={totalSessions} color="text-gray-900" icon={<Calendar className="h-6 w-6 text-indigo-500" />} />
          <StatCard title="Đã lên lịch" value={scheduledSessions} color="text-green-600" icon={<Clock className="h-6 w-6 text-green-500" />} />
          <StatCard title="Hoàn thành" value={completedSessions} color="text-orange-600" icon={<Users className="h-6 w-6 text-orange-500" />} />
          <StatCard title="Tổng sinh viên" value={totalStudents} color="text-blue-600" icon={<Users className="h-6 w-6 text-blue-500" />} />
        </div>

        {/* KHU VỰC 5: DANH SÁCH BUỔI HỌC (SESSIONS LIST) */}
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
                onClick={() => setIsDropdownOpen(true)}
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
                          <MapPin className="h-3 w-3 inline mr-1 text-gray-400" />
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
                        <StatusBadge status={session.sessionStatus || "PENDING"} />
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newPage = currentPage - 1;
                    setCurrentPage(newPage);
                    loadSessions(newPage);
                  }}
                  disabled={currentPage === 0}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="px-3 py-1 text-sm text-gray-700">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                
                <button
                  onClick={() => {
                    const newPage = currentPage + 1;
                    setCurrentPage(newPage);
                    loadSessions(newPage);
                  }}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                Hiển thị {Math.min((currentPage * 10) + 1, totalPages * 10)} - {Math.min((currentPage + 1) * 10, totalPages * 10)} trên tổng số {totalPages * 10}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Helper Components (Giữ nguyên) ---
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusMap: Record<string, { text: string; bg: string; color: string }> = {
    PENDING: { text: "Chờ xác nhận", bg: "bg-yellow-100", color: "text-yellow-800" },
    SCHEDULED: { text: "Đã lên lịch", bg: "bg-green-100", color: "text-green-800" },
    IN_PROGRESS: { text: "Đang diễn ra", bg: "bg-blue-100", color: "text-blue-800" },
    COMPLETED: { text: "Hoàn thành", bg: "bg-gray-100", color: "text-gray-800" },
    CANCELLED: { text: "Đã hủy", bg: "bg-red-100", color: "text-red-800" },
  };
  const statusInfo = statusMap[status] || { text: status, bg: "bg-gray-100", color: "text-gray-800" };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}
    >
      {statusInfo.text}
    </span>
  );
};

const FormatBadge: React.FC<{ format: SessionDTO['format'] }> = ({ format }) => {
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