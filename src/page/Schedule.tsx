import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  User,
  BookOpen,
  Hash,
} from "lucide-react";

const scheduleData = [
  {
    id: 1,
    courseName: "Toán Cao Cấp 1 - Giải tích",
    courseCode: "MT1003",
    instructor: "TS. Nguyễn Văn Minh",
    date: "Thứ 2\n04/11/2025",
    time: "07:30 - 09:30",
    location: "Phòng H1-101",
    locationType: "Offline",
  },
  {
    id: 2,
    courseName: "Vật Lý Đại Cương",
    courseCode: "PH1003",
    instructor: "ThS. Lê Văn Tuấn",
    date: "Thứ 2\n04/11/2025",
    time: "13:30 - 15:30",
    location: "Phòng H2-203",
    locationType: "Offline",
  },
  {
    id: 3,
    courseName: "Lập trình OOP",
    courseCode: "CO1027",
    instructor: "PGS.TS. Trần Thị Hương",
    date: "Thứ 3\n05/11/2025",
    time: "13:30 - 16:00",
    location: "Google Meet",
    locationType: "Online",
  },
  {
    id: 4,
    courseName: "Cơ sở Dữ liệu",
    courseCode: "CO2003",
    instructor: "TS. Phạm Thị Lan",
    date: "Thứ 7\n09/11/2025",
    time: "09:00 - 11:00",
    location: "Microsoft Teams",
    locationType: "Online",
  },
];

export default function SchedulePage() {
  const [weekStart] = useState("04/11/2025");
  const [weekEnd] = useState("10/11/2025");

  return (
    <div className="flex h-screen text-gray-900">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Lịch học
            </h1>
            <p className="text-gray-600">
              Xem danh sách các buổi học sắp tới và quản lý lịch trình của bạn
            </p>
          </div>

          {/* Week Selector */}
          <div className="mb-8 flex items-center justify-center gap-4 bg-white border border-gray-200 rounded-lg p-6">
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <ChevronLeft />
            </button>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                Tuần: {weekStart} - {weekEnd}
              </p>
            </div>
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <ChevronRight />
            </button>
          </div>

          {/* Schedule Table */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Lịch học sắp tới
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Danh sách các buổi học trong tuần hiện tại
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
  <table className="min-w-full text-sm table-auto md:table-fixed">
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs text-gray-700">#</th>
        <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs text-gray-700">Tên môn</th>
        <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs text-gray-700">Mã môn</th>
        <th className="hidden sm:table-cell px-2 sm:px-4 py-2 font-semibold text-xs text-gray-700">Giảng viên</th>
        <th className="px-2 sm:px-4 py-2 font-semibold text-xs text-gray-700">Ngày</th>
        <th className="hidden sm:table-cell px-2 sm:px-4 py-2 font-semibold text-xs text-gray-700">Giờ</th>
        <th className="hidden md:table-cell px-2 sm:px-4 py-2 font-semibold text-xs text-gray-700">Địa điểm</th>
        <th className="px-2 sm:px-4 py-2 font-semibold text-xs text-gray-700">Hình thức</th>
      </tr>
    </thead>
            

                <tbody>
                  {scheduleData.map((course, idx) => (
                    <tr
                      key={course.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-center text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {course.courseName}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                          {course.courseCode}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {course.instructor}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-pre-line">
                        {course.date}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {course.time}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {course.location}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium ${
                            course.locationType === "Offline"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {course.locationType === "Offline" ? (
                            <MapPin className="w-3 h-3" />
                          ) : (
                            <Laptop className="w-3 h-3" />
                          )}
                          {course.locationType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Info */}
            <div className="mt-6 flex items-center justify-between text-xs text-gray-600">
              <p>Tổng cộng: {scheduleData.length} buổi học</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>2 buổi Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>2 buổi Offline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
