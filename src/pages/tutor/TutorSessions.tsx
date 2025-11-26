import { useState, useEffect } from "react";
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
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
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

const TutorSessions = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [formatFilter, setFormatFilter] = useState<string>("ALL");

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      try {
        // TODO: Call real API
        // Hiện danh sách các môn học đã được admin duyệt
        const response = await axios.get(
          "http://localhost:8081/sessions",
        );
        console.log(response)
        // Const listSession
        const listSession: Session[] = response.data.data || [];
        console.log(listSession)
        // setTutorDataList(filtered);
        setSessions(listSession)

      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      toast.error("Không thể tải danh sách buổi học");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: number) => {
    if (!confirm("Bạn có chắc muốn xóa buổi học này?")) return;

    try {
      // TODO: Call real API
      // await tutorApi.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success("Đã xóa buổi học");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Không thể xóa buổi học");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      searchTerm === "" ||
      session.subjectName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || session.status === statusFilter;

    const matchesFormat =
      formatFilter === "ALL" || session.format === formatFilter;

    return matchesSearch && matchesStatus && matchesFormat;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Quản lý buổi học</title>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản lý buổi học
                </h1>
                <p className="mt-1 text-gray-600">
                  Tạo, chỉnh sửa và quản lý các buổi học của bạn
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadSessions}
                  className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </button>
                <button
                  onClick={() => navigate("/tutor/sessions/new")}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Tạo buổi học mới
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo môn học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="OPEN">Đang mở</option>
              <option value="FULL">Đã đầy</option>
              <option value="CLOSED">Đã đóng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả hình thức</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Tổng buổi học</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {sessions.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Đang mở</p>
            <p className="mt-1 text-2xl font-semibold text-green-600">
              {sessions.filter(s => s.status === "OPEN").length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Đã đầy</p>
            <p className="mt-1 text-2xl font-semibold text-orange-600">
              {sessions.filter(s => s.status === "FULL").length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Tổng sinh viên</p>
            <p className="mt-1 text-2xl font-semibold text-blue-600">
              {sessions.reduce((sum, s) => sum + s.currentQuantity, 0)}
            </p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="rounded-lg border border-gray-200 bg-white">
          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Không có buổi học nào
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || statusFilter !== "ALL" || formatFilter !== "ALL"
                  ? "Thử thay đổi bộ lọc để xem thêm kết quả"
                  : "Tạo buổi học đầu tiên của bạn"}
              </p>
              {!(searchTerm || statusFilter !== "ALL" || formatFilter !== "ALL") && (
                <button
                  onClick={() => navigate("/tutor/sessions/new")}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Tạo buổi học mới
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Môn học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Hình thức
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Địa điểm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {session.subjectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDateTime(session.startTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${session.format === "ONLINE"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                            }`}
                        >
                          {session.format === "ONLINE" ? (
                            <><Laptop className="h-3 w-3" /> Online</>
                          ) : (
                            <><MapPin className="h-3 w-3" /> Offline</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {session.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Users className="h-4 w-4 text-gray-400" />
                          {session.currentQuantity}/{session.maxQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${session.status === "OPEN"
                            ? "bg-green-100 text-green-800"
                            : session.status === "FULL"
                              ? "bg-orange-100 text-orange-800"
                              : session.status === "CLOSED"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {session.status === "OPEN"
                            ? "Đang mở"
                            : session.status === "FULL"
                              ? "Đã đầy"
                              : session.status === "CLOSED"
                                ? "Đã đóng"
                                : "Đã hủy"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/tutor/sessions/${session.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="text-red-600 hover:text-red-900"
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
    </>
  );
};

export default TutorSessions;
