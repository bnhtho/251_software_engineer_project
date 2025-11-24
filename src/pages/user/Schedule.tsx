import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  BookOpen,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import { scheduleApi } from "../../services/api";
import type { SessionDTO } from "../../types/api";
import toast from 'react-hot-toast';
export default function SchedulePage() {
  const { user } = useUser();
  const studentId = user?.id || 0;
  
  const [weekStart, setWeekStart] = useState("04/11/2025");
  const [weekEnd, setWeekEnd] = useState("10/11/2025");
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Load sessions data
  useEffect(() => {
    if (studentId) {
      loadSessions();
    }
  }, [studentId, weekStart, weekEnd]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      // Convert date format for API (assuming YYYY-MM-DD format)
      const startDate = convertToApiDate(weekStart);
      const endDate = convertToApiDate(weekEnd);
      
      const sessionsData = await scheduleApi.getStudentSessions(studentId, { // MISSING ENDPOINT
        startDate,
        endDate
      });
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Không thể tải lịch học');
      // Fallback to sample data for now
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD
  const convertToApiDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Helper function to format session data for display
  const formatSessionForDisplay = (session: SessionDTO) => {
    const sessionDate = new Date(session.sessionDate);
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = dayNames[sessionDate.getDay()];
    const dateStr = session.sessionDate.split('-').reverse().join('/'); // Convert YYYY-MM-DD to DD/MM/YYYY
    
    return {
      id: session.id,
      courseName: session.course?.name || 'N/A',
      courseCode: session.course?.code || 'N/A',
      instructor: session.course?.tutorName || 'N/A',
      date: `${dayName}\n${dateStr}`,
      time: `${session.startTime} - ${session.endTime}`,
      location: session.location || (session.locationType === 'ONLINE' ? session.meetingLink : 'N/A') || 'N/A',
      locationType: session.locationType || 'OFFLINE',
    };
  };

  const displaySessions = sessions.map(formatSessionForDisplay);
  const onlineCount = sessions.filter(s => s.locationType === 'ONLINE').length;
  const offlineCount = sessions.filter(s => s.locationType === 'OFFLINE').length;

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

  return (
    <>
      <title>Lịch học</title>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Calendar className="h-6 w-6 text-blue-600" />
              Lịch học
            </h1>
            <p className="text-gray-600">
              Xem danh sách các buổi học sắp tới và quản lý lịch trình của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="flex items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
              <button className="rounded-md border border-gray-300 px-3 py-2 transition-colors hover:bg-gray-50">
                <ChevronLeft />
              </button>
              <div className="text-center">
                <p className="flex items-center justify-center gap-2 text-sm font-medium text-gray-900">
                  <Calendar className="h-4 w-4" />
                  Tuần: {weekStart} - {weekEnd}
                </p>
              </div>
              <button className="rounded-md border border-gray-300 px-3 py-2 transition-colors hover:bg-gray-50">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Tổng buổi học</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {scheduleData.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Online</p>
                  <p className="text-2xl font-semibold text-gray-900">{onlineCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Offline</p>
                  <p className="text-2xl font-semibold text-gray-900">{offlineCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Tuần này</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {sessions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Lịch học sắp tới
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                Danh sách các buổi học trong tuần hiện tại
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        #
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        Tên môn
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        Mã môn
                      </th>
                      <th className="hidden px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:table-cell">
                        Giảng viên
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        Ngày
                      </th>
                      <th className="hidden px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:table-cell">
                        Giờ
                      </th>
                      <th className="hidden px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 md:table-cell">
                        Địa điểm
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        Hình thức
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displaySessions.map((course, idx) => (
                      <tr
                        key={course.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-2 py-4 text-center font-medium text-gray-900 sm:px-4">
                          {idx + 1}
                        </td>
                        <td className="px-2 py-4 font-medium text-gray-900 sm:px-4">
                          {course.courseName}
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <span className="inline-block rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                            {course.courseCode}
                          </span>
                        </td>
                        <td className="hidden px-2 py-4 text-sm text-gray-700 sm:px-4 sm:table-cell">
                          {course.instructor}
                        </td>
                        <td className="whitespace-pre-line px-2 py-4 text-sm text-gray-700 sm:px-4">
                          {course.date}
                        </td>
                        <td className="hidden px-2 py-4 text-sm text-gray-700 sm:px-4 sm:table-cell">
                          {course.time}
                        </td>
                        <td className="hidden px-2 py-4 text-sm text-gray-700 sm:px-4 md:table-cell">
                          {course.location}
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-3 py-1 text-xs font-medium ${
                              course.locationType === "OFFLINE"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {course.locationType === "OFFLINE" ? (
                              <MapPin className="h-3 w-3" />
                            ) : (
                              <Laptop className="h-3 w-3" />
                            )}
                            {course.locationType === "OFFLINE" ? "Offline" : "Online"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

