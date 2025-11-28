import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  ArrowRight,
  CheckCircle2,
  User,
  MapPin,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import moment from "moment";

interface HistoryItem {
  studentSessionId: number;
  sessionId: number;
  subjectName: string;
  tutorName: string;
  startTime: string;
  endTime: string;
  location: string;
  format: string;
  registrationStatus: string;
  sessionStatus: string;
  registeredDate: string;
  updatedDate: string | null;
  subjectCode: string | null;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  trend?: string;
}

const StatCard = ({ icon, value, label, color, trend }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
      </div>
      {trend && (
        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
          {trend}
        </span>
      )}
    </div>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken") || "";

  useEffect(() => {
    if (user && !isLoading) {
      fetchHistory();
    }
  }, [user, isLoading]);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(
        `http://localhost:8081/students/history/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!res.ok) {
        // If 403 or other error, just set empty array
        setHistoryItems([]);
        return;
      }
      
      const data = await res.json();
      setHistoryItems(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingSessions = () => {
    return historyItems
      .filter((item) => {
        const sessionDate = moment(item.startTime);
        return (
          sessionDate.isAfter(moment()) &&
          (item.sessionStatus === "SCHEDULED" ||
            item.sessionStatus === "IN_PROGRESS")
        );
      })
      .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)))
      .slice(0, 3);
  };

  const getRecentCompletedSessions = () => {
    return historyItems
      .filter((item) => item.sessionStatus === "COMPLETED")
      .sort((a, b) => moment(b.startTime).diff(moment(a.startTime)))
      .slice(0, 3);
  };

  const stats = {
    totalCourses: historyItems.length,
    completedCourses: historyItems.filter(
      (item) => item.sessionStatus === "COMPLETED"
    ).length,
    upcomingSessions: historyItems.filter((item) => {
      const sessionDate = moment(item.startTime);
      return (
        sessionDate.isAfter(moment()) &&
        (item.sessionStatus === "SCHEDULED" ||
          item.sessionStatus === "IN_PROGRESS")
      );
    }).length,
    totalHours: Math.round(
      historyItems.reduce((acc, item) => {
        const duration = moment
          .duration(moment(item.endTime).diff(moment(item.startTime)))
          .asHours();
        return acc + duration;
      }, 0)
    ),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Đã lên lịch
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Đang diễn ra
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Hoàn thành
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <title>Dashboard - Học viên</title>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Xin chào, {user?.firstName || "Học viên"}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Đây là tổng quan về tiến trình học tập của bạn
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-blue-600" />}
            value={stats.totalCourses}
            label="Tổng khóa học"
            color="bg-blue-50"
          />
          <StatCard
            icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
            value={stats.completedCourses}
            label="Đã hoàn thành"
            color="bg-green-50"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6 text-purple-600" />}
            value={stats.upcomingSessions}
            label="Buổi học sắp tới"
            color="bg-purple-50"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            value={`${stats.totalHours}h`}
            label="Tổng thời gian học"
            color="bg-orange-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0E7AA0]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Lịch học sắp tới
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/dashboard/schedule")}
                  className="flex items-center gap-1 text-sm text-[#0E7AA0] hover:underline"
                >
                  Xem tất cả
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : getUpcomingSessions().length > 0 ? (
                <div className="space-y-4">
                  {getUpcomingSessions().map((item) => (
                    <div
                      key={item.studentSessionId}
                      className="p-4 border border-gray-200 rounded-lg hover:border-[#0E7AA0] hover:bg-blue-50/50 transition-all cursor-pointer"
                      onClick={() => navigate("/dashboard/schedule")}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {item.subjectName}
                            </h3>
                            {getStatusBadge(item.sessionStatus)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{item.tutorName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {moment(item.startTime).format(
                                  "DD/MM/YYYY HH:mm"
                                )}{" "}
                                - {moment(item.endTime).format("HH:mm")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {item.location} ({item.format})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Chưa có lịch học sắp tới nào
                  </p>
                  <button
                    onClick={() => navigate("/dashboard/courses")}
                    className="mt-4 px-4 py-2 bg-[#0E7AA0] text-white rounded-lg hover:bg-[#0a5f7a] transition-colors"
                  >
                    Đăng ký khóa học
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Thao tác nhanh
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard/courses")}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#0E7AA0] hover:bg-blue-50 transition-all"
                >
                  <BookOpen className="w-5 h-5 text-[#0E7AA0]" />
                  <span className="font-medium text-gray-900">
                    Tìm khóa học
                  </span>
                </button>
                <button
                  onClick={() => navigate("/dashboard/schedule")}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#0E7AA0] hover:bg-blue-50 transition-all"
                >
                  <Calendar className="w-5 h-5 text-[#0E7AA0]" />
                  <span className="font-medium text-gray-900">
                    Xem lịch học
                  </span>
                </button>
                <button
                  onClick={() => navigate("/dashboard/materials")}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#0E7AA0] hover:bg-blue-50 transition-all"
                >
                  <FileText className="w-5 h-5 text-[#0E7AA0]" />
                  <span className="font-medium text-gray-900">Tài liệu</span>
                </button>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-[#0E7AA0] to-[#0a5f7a] rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Tiến độ học tập</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Hoàn thành</span>
                    <span className="font-semibold">
                      {stats.totalCourses > 0
                        ? Math.round(
                            (stats.completedCourses / stats.totalCourses) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all"
                      style={{
                        width: `${
                          stats.totalCourses > 0
                            ? (stats.completedCourses / stats.totalCourses) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-blue-100">
                  Bạn đã hoàn thành {stats.completedCourses} trong{" "}
                  {stats.totalCourses} khóa học
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Callout */}
        
      </div>
    </>
  );
};

export default HomePage;
