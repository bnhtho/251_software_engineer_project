import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface DashboardStats {
  totalSessions: number;
  upcomingSessions: number;
  pendingRegistrations: number;
  totalStudents: number;
  completedSessions: number;
  cancelledSessions: number;
}

interface UpcomingSession {
  id: number;
  subjectName: string;
  studentName: string;
  startTime: string;
  endTime: string;
  format: string;
  location: string;
}

interface PendingRegistration {
  id: number;
  studentName: string;
  sessionSubject: string;
  registrationDate: string;
}

const TutorHomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    upcomingSessions: 0,
    pendingRegistrations: 0,
    totalStudents: 0,
    completedSessions: 0,
    cancelledSessions: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // TODO: Call real APIs when available
      // For now, use mock data
      
      // Mock stats
      setStats({
        totalSessions: 24,
        upcomingSessions: 5,
        pendingRegistrations: 3,
        totalStudents: 18,
        completedSessions: 19,
        cancelledSessions: 0,
      });

      // Mock upcoming sessions
      setUpcomingSessions([
        {
          id: 1,
          subjectName: "Giải tích 1",
          studentName: "Nguyễn Văn A",
          startTime: "2025-11-26T08:00:00",
          endTime: "2025-11-26T10:00:00",
          format: "ONLINE",
          location: "Google Meet",
        },
        {
          id: 2,
          subjectName: "Vật lý 1",
          studentName: "Trần Thị B",
          startTime: "2025-11-26T14:00:00",
          endTime: "2025-11-26T16:00:00",
          format: "OFFLINE",
          location: "H1-101",
        },
      ]);

      // Mock pending registrations
      setPendingRegistrations([
        {
          id: 1,
          studentName: "Lê Văn C",
          sessionSubject: "Toán rời rạc",
          registrationDate: "2025-11-25T10:30:00",
        },
        {
          id: 2,
          studentName: "Phạm Thị D",
          sessionSubject: "Cấu trúc dữ liệu",
          registrationDate: "2025-11-25T11:15:00",
        },
      ]);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      <title>Dashboard Gia sư</title>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="text-2xl font-bold text-gray-900">
              Xin chào, {user?.firstName} {user?.lastName}!
            </h1>
            <p className="mt-1 text-gray-600">
              Đây là tổng quan về hoạt động giảng dạy của bạn
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Sessions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng buổi học</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.totalSessions}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  <span className="text-green-600">✓ {stats.completedSessions} hoàn thành</span>
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sắp diễn ra</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.upcomingSessions}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Trong 7 ngày tới
                </p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Pending Registrations */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats.pendingRegistrations}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Yêu cầu đăng ký mới
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upcoming Sessions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Buổi học sắp tới
              </h2>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Không có buổi học sắp tới</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {session.subjectName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <Users className="inline h-4 w-4 mr-1" />
                          {session.studentName}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <Clock className="inline h-4 w-4 mr-1" />
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </p>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          session.format === "ONLINE"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {session.format === "ONLINE" ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Registrations */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Yêu cầu đăng ký
              </h2>
              <button
                onClick={() => navigate("/tutor/registrations")}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {pendingRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Không có yêu cầu mới</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {registration.studentName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {registration.sessionSubject}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDateTime(registration.registrationDate)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          className="rounded bg-green-600 p-2 text-white hover:bg-green-700"
                          title="Chấp nhận"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded bg-red-600 p-2 text-white hover:bg-red-700"
                          title="Từ chối"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate("/tutor/sessions/new")}
              className="rounded-lg border border-gray-300 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Tạo buổi học mới</h3>
              <p className="text-sm text-gray-500 mt-1">Thêm lịch dạy mới</p>
            </button>

            <button
              onClick={() => navigate("/tutor/registrations")}
              className="rounded-lg border border-gray-300 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <Users className="h-6 w-6 text-orange-600 mb-2" />
              <h3 className="font-medium text-gray-900">Quản lý đăng ký</h3>
              <p className="text-sm text-gray-500 mt-1">Duyệt yêu cầu sinh viên</p>
            </button>

            <button
              onClick={() => navigate("/tutor/profile")}
              className="rounded-lg border border-gray-300 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">Hồ sơ của tôi</h3>
              <p className="text-sm text-gray-500 mt-1">Xem & cập nhật thông tin</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorHomePage;

