import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  // User,
  BookOpen,
  // Hash,
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
    <>
    <title>Lịch học</title>
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Lịch học
          </h1>
          <p className="text-gray-600">
            Xem danh sách các buổi học sắp tới và quản lý lịch trình của bạn
          </p>
        </div>
      </div>

      {/* Week Selector */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 md:col-start-3">
          <div className="flex items-center justify-center gap-4 bg-white border border-gray-200 rounded-lg p-6">
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
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng buổi học</p>
                <p className="text-2xl font-semibold text-gray-900">{scheduleData.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-2xl font-semibold text-gray-900">2</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-2xl font-semibold text-gray-900">2</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Tuần này</p>
                <p className="text-2xl font-semibold text-gray-900">{scheduleData.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-2 text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Lịch học sắp tới
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Danh sách các buổi học trong tuần hiện tại
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">#</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Tên môn</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Mã môn</th>
                    <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Giảng viên</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Ngày</th>
                    <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Giờ</th>
                    <th className="hidden md:table-cell px-2 sm:px-4 py-3 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Địa điểm</th>
                    <th className="px-2 sm:px-4 py-3 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Hình thức</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scheduleData.map((course, idx) => (
                    <tr
                      key={course.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 sm:px-4 py-4 text-center text-gray-900 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-2 sm:px-4 py-4 font-medium text-gray-900">
                        {course.courseName}
                      </td>
                      <td className="px-2 sm:px-4 py-4">
                        <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                          {course.courseCode}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-4 py-4 text-sm text-gray-700">
                        {course.instructor}
                      </td>
                      <td className="px-2 sm:px-4 py-4 text-sm text-gray-700 whitespace-pre-line">
                        {course.date}
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-4 py-4 text-sm text-gray-700">
                        {course.time}
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-4 py-4 text-sm text-gray-700">
                        {course.location}
                      </td>
                      <td className="px-2 sm:px-4 py-4">
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
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
