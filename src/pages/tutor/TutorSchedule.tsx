import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  BookOpen,
  RefreshCw,
  Download,
  Users,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import toast from "react-hot-toast";

interface Session {
  id: number;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  format: "ONLINE" | "OFFLINE";
  location: string;
  studentCount: number;
  maxStudents: number;
}

const TutorSchedule = () => {
  const { user } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weekStart, setWeekStart] = useState("25/11/2025");
  const [weekEnd, setWeekEnd] = useState("01/12/2025");

  useEffect(() => {
    loadSchedule();
  }, [user, weekStart]);

  const loadSchedule = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // TODO: Call real API
      // const response = await tutorApi.getTutorSchedule(user.id, weekStart, weekEnd);
      
      // Mock data
      setSessions([
        {
          id: 1,
          subjectName: "Giải tích 1",
          date: "2025-11-26",
          startTime: "08:00",
          endTime: "10:00",
          format: "ONLINE",
          location: "Google Meet",
          studentCount: 8,
          maxStudents: 10,
        },
        {
          id: 2,
          subjectName: "Vật lý 1",
          date: "2025-11-27",
          startTime: "14:00",
          endTime: "16:00",
          format: "OFFLINE",
          location: "H1-101",
          studentCount: 15,
          maxStudents: 15,
        },
        {
          id: 3,
          subjectName: "Toán rời rạc",
          date: "2025-11-28",
          startTime: "10:00",
          endTime: "12:00",
          format: "ONLINE",
          location: "Zoom",
          studentCount: 5,
          maxStudents: 12,
        },
        {
          id: 4,
          subjectName: "Cấu trúc dữ liệu",
          date: "2025-11-29",
          startTime: "08:30",
          endTime: "10:30",
          format: "OFFLINE",
          location: "H2-201",
          studentCount: 10,
          maxStudents: 12,
        },
      ]);
    } catch (error) {
      console.error("Error loading schedule:", error);
      toast.error("Không thể tải lịch dạy");
    } finally {
      setLoading(false);
    }
  };

  const changeWeek = (direction: "prev" | "next") => {
    const [day, month, year] = weekStart.split("/").map(Number);
    const currentDate = new Date(year, month - 1, day);
    
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 7);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    const newStart = currentDate.toLocaleDateString("en-GB");
    
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 6);
    const newEnd = endDate.toLocaleDateString("en-GB");
    
    setWeekStart(newStart);
    setWeekEnd(newEnd);
  };

  const exportSchedule = () => {
    if (sessions.length === 0) {
      toast.error("Không có buổi học nào để xuất");
      return;
    }

    let ical = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Tutor System//Teaching Schedule//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;

    sessions.forEach(session => {
      const startDateTime = `${session.date.replace(/-/g, "")}T${session.startTime.replace(/:/g, "")}00`;
      const endDateTime = `${session.date.replace(/-/g, "")}T${session.endTime.replace(/:/g, "")}00`;
      
      ical += `BEGIN:VEVENT\n`;
      ical += `UID:session-${session.id}@tutorsystem.com\n`;
      ical += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`;
      ical += `DTSTART:${startDateTime}\n`;
      ical += `DTEND:${endDateTime}\n`;
      ical += `SUMMARY:${session.subjectName} (Dạy)\n`;
      ical += `DESCRIPTION:Số học viên: ${session.studentCount}/${session.maxStudents}\n`;
      ical += `LOCATION:${session.location}\n`;
      ical += `STATUS:CONFIRMED\n`;
      ical += `END:VEVENT\n`;
    });

    ical += `END:VCALENDAR`;

    const blob = new Blob([ical], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `lich-day-${weekStart.replace(/\//g, "-")}.ics`;
    link.click();
    toast.success("Đã xuất lịch dạy thành công!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const dayName = dayNames[date.getDay()];
    const dateStr = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    return `${dayName}\n${dateStr}`;
  };

  const displaySessions = sessions.map(s => ({
    ...s,
    formattedDate: formatDate(s.date),
  }));

  const onlineCount = sessions.filter(s => s.format === "ONLINE").length;
  const offlineCount = sessions.filter(s => s.format === "OFFLINE").length;
  const totalStudents = sessions.reduce((sum, s) => sum + s.studentCount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải lịch dạy...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Lịch dạy</title>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Lịch dạy
                </h1>
                <p className="mt-1 text-gray-600">
                  Xem thời gian biểu giảng dạy của bạn
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportSchedule}
                  disabled={sessions.length === 0}
                  className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Xuất lịch dạy sang file iCal"
                >
                  <Download className="h-4 w-4" />
                  Xuất lịch
                </button>
                <button
                  onClick={loadSchedule}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Làm mới
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="flex items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
              <button 
                onClick={() => changeWeek("prev")}
                className="rounded-md border border-gray-300 px-3 py-2 transition-colors hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Tuần</p>
                <p className="text-lg font-semibold text-gray-900">
                  {weekStart} - {weekEnd}
                </p>
              </div>
              
              <button 
                onClick={() => changeWeek("next")}
                className="rounded-md border border-gray-300 px-3 py-2 transition-colors hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng buổi dạy</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Laptop className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {onlineCount}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {offlineCount}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng học viên</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalStudents}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="rounded-lg border border-gray-200 bg-white">
          {sessions.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Không có buổi dạy nào
              </h3>
              <p className="mt-2 text-gray-500">
                Bạn chưa có lịch dạy nào trong tuần này
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Môn học
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Ngày
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Giờ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Địa điểm
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Hình thức
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Học viên
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {displaySessions.map((session, idx) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-center font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {session.subjectName}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-pre-line text-sm text-gray-600">
                        {session.formattedDate}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {session.startTime} - {session.endTime}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {session.location}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-3 py-1 text-xs font-medium ${
                            session.format === "OFFLINE"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {session.format === "OFFLINE" ? (
                            <><MapPin className="h-3 w-3" /> Offline</>
                          ) : (
                            <><Laptop className="h-3 w-3" /> Online</>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Users className="h-4 w-4 text-gray-400" />
                          {session.studentCount}/{session.maxStudents}
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              session.studentCount === session.maxStudents
                                ? "bg-orange-500"
                                : "bg-blue-600"
                            }`}
                            style={{
                              width: `${(session.studentCount / session.maxStudents) * 100}%`,
                            }}
                          ></div>
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

export default TutorSchedule;
