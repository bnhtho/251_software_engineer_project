import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  BookOpen,
  RefreshCw,
  Filter,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "../../Context/UserContext";

interface SessionDTO {
  id: number;
  sessionDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionLocation?: string;
  sessionFormat: 'ONLINE' | 'OFFLINE' | string;
  meetingLink?: string;
  status: string;
  sessionSubject?: string;
  course?: {
    name: string;
    code: string;
    tutorName: string;
  };
}

interface SessionDisplayInfo {
  id: number;
  sessionSubject: string;
  courseCode: string;
  instructor: string;
  date: string;
  time: string;
  location: string;
  sessionFormat: 'ONLINE' | 'OFFLINE' | string;
  status: string;
}

const getWeekStart = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
};

const formatDateForDisplay = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
};

// --- MAIN COMPONENT ---

export default function SchedulePage() {
  const { user } = useUser();
  const [weekOffset, setWeekOffset] = useState(0);
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState<"all" | "online" | "offline">("all");

  // --- Date Calculation ---
  const currentWeekStart = useMemo(() => {
    const startOfWeek = getWeekStart(new Date());
    startOfWeek.setDate(startOfWeek.getDate() + weekOffset * 7);
    return startOfWeek;
  }, [weekOffset]);

  const weekStartDisplay = formatDateForDisplay(currentWeekStart);
  const weekEndDisplay = useMemo(() => {
    const endOfWeek = new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    return formatDateForDisplay(endOfWeek);
  }, [currentWeekStart]);

  // --- Data Fetching ---
  const loadSessions = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Phiên đăng nhập hết hạn.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8081/students/schedule/${weekOffset}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sessionsData: SessionDTO[] = response.data.data || response.data;
      setSessions(sessionsData);
      console.log(sessionsData)
    } catch (error: any) {
      console.error("Error loading sessions:", error);
      toast.error("Không thể tải lịch học");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [weekOffset]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const changeWeek = (direction: "prev" | "next") => {
    setWeekOffset((prev) => (direction === "prev" ? prev - 1 : prev + 1));
  };

  // --- Data Processing (Đã sửa lỗi và bỏ N/A) ---
  const formatSessionForDisplay = (session: SessionDTO): SessionDisplayInfo => {
    // const rawDate = session.sessionStartTime ? session.sessionStartTime;
    const rawDate = session.sessionStartTime ? session.sessionStartTime.split('T')[0] : "";

    const startTimeOnly = session.sessionStartTime ? session.sessionStartTime.split('T')[1]?.substring(0, 5) : "";
    const endTimeOnly = session.sessionEndTime ? session.sessionEndTime.split('T')[1]?.substring(0, 5) : "";




    console.log("Raw Date", rawDate)
    // Xử lý ngày: Nếu không có ngày, trả về chuỗi rỗng
    let dateStr = "";
    let dayName = "";

    if (rawDate) {
      dateStr = rawDate.split("-").reverse().join("/");
      const sessionDate = new Date(rawDate);
      const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
      dayName = dayNames[sessionDate.getDay()];
    }

    // Xử lý Location: Ưu tiên location cụ thể -> meeting link -> rỗng
    let locationDisplay = "";
    if (session.sessionLocation) {
      locationDisplay = session.sessionLocation;
    } else if (session.sessionFormat === "online") {
      locationDisplay = session.meetingLink || "";
    }

    return {
      id: session.id,
      sessionSubject: session.sessionSubject || session.course?.name || "",
      courseCode: session.course?.code || "",
      instructor: session.course?.tutorName || "",
      date: rawDate ? `${dayName}\n${dateStr}` : "", // Chỉ ghép chuỗi nếu có dữ liệu
      time: (startTimeOnly && endTimeOnly) ? `${startTimeOnly} - ${endTimeOnly}` : "",
      location: locationDisplay,
      sessionFormat: session.sessionFormat || "OFFLINE",
      status: session.status || "",
    };
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Chuẩn hóa dữ liệu API về chữ hoa để so sánh
      const format = s.sessionFormat ? s.sessionFormat.toUpperCase() : "OFFLINE";

      if (locationFilter === "all") return true;
      if (locationFilter === "online") return format === "ONLINE";
      if (locationFilter === "offline") return format === "OFFLINE";
      return true;
    });
  }, [sessions, locationFilter]);

  const displaySessions: SessionDisplayInfo[] = filteredSessions.map(formatSessionForDisplay);
  const offlineCount = sessions.filter((s) => s.sessionFormat?.toUpperCase() === "OFFLINE").length;
  const onlineCount = sessions.filter((s) => s.sessionFormat?.toUpperCase() === "ONLINE").length;

  // const onlineCount = sessions.filter((s) => s.sessionFormat === "ONLINE").length;
  // const offlineCount = sessions.filter((s) => s.sessionFormat === "OFFLINE").length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SCHEDULED":
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Đã lên lịch";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return status;
    }
  }

  // --- Render ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải lịch học...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vui lòng đăng nhập</h3>
          <p className="text-gray-600 mb-4">
            Bạn cần đăng nhập bằng tài khoản sinh viên để xem lịch học
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Lịch học</title>
      <div className="space-y-8 p-6">
        {/* Header và Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Calendar className="h-6 w-6 text-blue-600" />
              Lịch học
            </h1>
            {/* <p className="text-gray-600">
              Tuần: <strong>{weekStartDisplay} - {weekEndDisplay}</strong>
            </p> */}
          </div>
          <button
            onClick={loadSessions}
            disabled={loading}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
        </div>

        {/* --- Week Navigation & Filter --- */}
        <div className="grid grid-cols-12 gap-4">
          {/* Week Navigation */}
          <div className="col-span-12 lg:col-span-4">
            <div className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
              <button
                onClick={() => changeWeek("prev")}
                className="rounded-md border border-gray-300 px-2 py-1 transition-colors hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-900">
                <strong>{weekStartDisplay} - {weekEndDisplay}</strong>
              </span>
              <button
                onClick={() => changeWeek("next")}
                className="rounded-md border border-gray-300 px-2 py-1 transition-colors hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Location Filter */}
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-lg border border-gray-200 bg-white p-2 flex gap-2">
              <button
                onClick={() => setLocationFilter("all")}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${locationFilter === "all" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Filter className="h-4 w-4" />
                Tất cả ({sessions.length})
              </button>
              <button
                onClick={() => setLocationFilter("online")}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${locationFilter === "online" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Laptop className="h-4 w-4" />
                Online ({onlineCount})
              </button>
              <button
                onClick={() => setLocationFilter("offline")}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${locationFilter === "offline" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <MapPin className="h-4 w-4" />
                Offline ({offlineCount})
              </button>
            </div>
          </div>
        </div>

        {/* --- Sessions Table / Empty State --- */}
        <div className="mt-6">
          {filteredSessions.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {sessions.length === 0 ? "Chưa có buổi học nào" : "Không có kết quả"}
              </h3>
              <p className="text-gray-600">
                {sessions.length === 0
                  ? "Bạn chưa đăng ký buổi học nào trong tuần này."
                  : `Không có buổi học ${locationFilter === "online" ? "online" : "offline"} trong tuần này.`}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">#</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">Môn học</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">Thứ</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">Ngày & Giờ</th>
                      <th className="hidden px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 lg:table-cell">Địa điểm</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">Trạng thái</th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">Hình thức</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">

                    {displaySessions.map((session, index) => (
                      < tr key={session.id} className="hover:bg-gray-50" >
                        {/* STT */}
                        < td className="whitespace-nowrap px-2 py-4 text-center text-sm font-medium text-gray-900 sm:px-4" >
                          {index + 1}
                        </td>

                        {/* Môn học */}
                        <td className="max-w-xs px-2 py-4 text-sm font-medium text-gray-900 sm:px-4">
                          <span className="line-clamp-2">{session.sessionSubject}</span>
                          {/* Chỉ hiển thị mã môn nếu có dữ liệu */}
                          {session.courseCode && (
                            <span className="block text-xs text-gray-500">({session.courseCode})</span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-2 py-4 text-sm font-semibold text-gray-900 sm:px-4">
                          {session.date ? session.date.split("\n")[0] : <span className="text-xs text-gray-400">---</span>}
                        </td>

                        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500 sm:px-4">
                          {session.date ? (
                            <div className="flex flex-col space-y-1">
                              {/* Chỉ hiển thị Ngày (DD/MM/YYYY) */}
                              <span className="font-medium text-gray-900">{session.date.split("\n")[1] || ""}</span>

                              {/* Hiển thị Giờ */}
                              {session.time && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                  <span className="font-medium">{session.time}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Chưa cập nhật</span>
                          )}
                        </td>


                        {/* Địa điểm */}
                        <td className="hidden max-w-xs whitespace-nowrap px-2 py-4 text-sm text-gray-500 lg:table-cell">
                          <div className="flex items-start">
                            {session.sessionFormat === "OFFLINE" && session.location && (
                              <MapPin className="mt-1 mr-1 h-4 w-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="line-clamp-2">{session.location}</span>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="whitespace-nowrap px-2 py-4 text-sm sm:px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              session.status,
                            )}`}
                          >
                            {(session.status === "SCHEDULED" || session.status === "CONFIRMED") && <CheckCircle className="mr-1 h-3 w-3" />}
                            {getStatusText(session.status)}
                          </span>
                        </td>

                        {/* Hình thức */}
                        <td className="whitespace-nowrap px-2 py-4 text-sm sm:px-4">
                          <div
                            className={`flex items-center gap-1 ${session.sessionFormat === "ONLINE" ? "text-blue-600" : "text-green-600"
                              }`}
                          >
                            {session.sessionFormat === "ONLINE" ? (
                              <Laptop className="h-4 w-4" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                            <span className="text-xs font-medium uppercase">
                              {session.sessionFormat === "ONLINE" ? "Online" : "Offline"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div >
      </div >
    </>
  );
}