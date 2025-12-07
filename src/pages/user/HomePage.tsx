import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import moment from "moment";

interface ScheduleItem {
  id: number;
  studentId: number;
  studentName: string;
  sessionId: number;
  sessionSubject: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionLocation: string;
  sessionFormat: string;
  status: string;
  sessionDayOfWeek: string;
  confirmedDate: string;
  registeredDate: string;
  updatedDate: string;
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
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken") || "";

  const fetchHistory = useCallback(async () => {

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8081/students/schedule/0`, // chỉ cần page = 0
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        let errorMsg = `Error: ${res.status}`;
        try {
          const errData = await res.json();
          errorMsg = errData.message || errorMsg;
        } catch (_) { }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log("Schedule API response:", data);

      if (data.statusCode === 200 && Array.isArray(data.data)) {
        setScheduleItems(data.data);
      } else {
        console.warn("API format unexpected:", data);
        setScheduleItems([]);
      }

    } catch (err) {
      console.error("Fetch schedule error:", err);
      setScheduleItems([]);
    } finally {
      setLoading(false);
    }

  }, [token]);

  // Logic lọc "Sắp tới" dựa trên field name mới
  const getUpcomingSessions = () => {
    return scheduleItems
      .filter((item) => {
        const sessionDate = moment(item.sessionStartTime);
        return (
          sessionDate.isAfter(moment()) &&
          (item.status === "CONFIRMED" || item.status === "IN_PROGRESS" || item.status === "SCHEDULED")
        );
      })
      .sort((a, b) => moment(a.sessionStartTime).diff(moment(b.sessionStartTime)))
      .slice(0, 3);
  };
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  const stats = {
    totalCourses: scheduleItems.length,
    completedCourses: scheduleItems.filter(
      (item) => item.status === "COMPLETED"
    ).length,
    upcomingSessions: scheduleItems.filter((item) => {
      const sessionDate = moment(item.sessionStartTime);
      return (
        sessionDate.isAfter(moment()) &&
        (item.status === "CONFIRMED" || item.status === "SCHEDULED" || item.status === "IN_PROGRESS")
      );
    }).length,
    totalHours: Math.round(
      scheduleItems.reduce((acc, item) => {
        const duration = moment
          .duration(moment(item.sessionEndTime).diff(moment(item.sessionStartTime)))
          .asHours();
        return acc + duration;
      }, 0)
    ),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
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
      <title>Dashboard - Sinh viên</title>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Xin chào, {user?.firstName} {user?.lastName} 👋
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
            label="Tổng buổi học"
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
                    Lịch học trong tuần
                  </h2>
                </div>

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
                      key={item.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-[#0E7AA0] hover:bg-blue-50/50 transition-all cursor-pointer"
                      onClick={() => navigate("schedule")}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {/* Update field name display */}
                            <h3 className="font-semibold text-gray-900">
                              {item.sessionSubject}
                            </h3>
                            {getStatusBadge(item.status)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {moment(item.sessionStartTime).format(
                                  "DD/MM/YYYY HH:mm"
                                )}{" "}
                                - {moment(item.sessionEndTime).format("HH:mm")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {item.sessionLocation} ({item.sessionFormat})
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
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Thao tác nhanh
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("sessions")}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#0E7AA0] hover:bg-blue-50 transition-all"
                >
                  <BookOpen className="w-5 h-5 text-[#0E7AA0]" />
                  <span className="font-medium text-gray-900">
                    Đăng ký buổi học
                  </span>
                </button>
                <button
                  onClick={() => navigate("materials")}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#0E7AA0] hover:bg-blue-50 transition-all"
                >
                  <Calendar className="w-5 h-5 text-[#0E7AA0]" />
                  <span className="font-medium text-gray-900">
                    Xem lịch học
                  </span>
                </button>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-[#0E7AA0] to-[#0a5f7a] rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Tiến độ</h3>
              <p className="text-sm text-blue-100">
                {stats.completedCourses} / {stats.totalCourses} buổi đã hoàn thành.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;