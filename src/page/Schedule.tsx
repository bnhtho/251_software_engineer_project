// const userID =
import { useParams } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
const scheduleData = [
  {
    id: 1,
    courseName: "Toán Cao Cấp 1 - Giải tích",
    courseCode: "MT1003",
    instructor: "TS. Nguyễn Văn Minh",
    date: "Thứ 2\n04/11/2025",
    time: "07:30 - 09:30",
    location: "Phòng H1-101",
    locationType: "Trực tiếp",
  },
  {
    id: 2,
    courseName: "Vật Lý Đại Cương",
    courseCode: "PH1003",
    instructor: "ThS. Lê Văn Tuấn",
    date: "Thứ 2\n04/11/2025",
    time: "13:30 - 15:30",
    location: "Phòng H2-203",
    locationType: "Trực tiếp",
  },
  {
    id: 3,
    courseName: "Lập trình OOP",
    courseCode: "CO1027",
    instructor: "PGS.TS. Trần Thị Hương",
    date: "Thứ 3\n05/11/2025",
    time: "13:30 - 16:00",
    location: "Google Meet",
    locationType: "Trực tuyến",
  },
  {
    id: 4,
    courseName: "Toán Cao Cấp 1 - Giải tích",
    courseCode: "MT1003",
    instructor: "TS. Nguyễn Văn Minh",
    date: "Thứ 4\n06/11/2025",
    time: "07:30 - 09:30",
    location: "Phòng H1-101",
    locationType: "Trực tiếp",
  },
  {
    id: 5,
    courseName: "Vật Lý Đại Cương",
    courseCode: "PH1003",
    instructor: "ThS. Lê Văn Tuấn",
    date: "Thứ 5\n07/11/2025",
    time: "09:00 - 11:00",
    location: "Phòng H2-203",
    locationType: "Trực tiếp",
  },
  {
    id: 6,
    courseName: "Lập trình OOP",
    courseCode: "CO1027",
    instructor: "PGS.TS. Trần Thị Hương",
    date: "Thứ 5\n07/11/2025",
    time: "13:30 - 16:00",
    location: "Zoom Meeting",
    locationType: "Trực tuyến",
  },
  {
    id: 7,
    courseName: "Toán Cao Cấp 1 - Giải tích",
    courseCode: "MT1003",
    instructor: "TS. Nguyễn Văn Minh",
    date: "Thứ 6\n08/11/2025",
    time: "07:30 - 09:30",
    location: "Phòng H1-101",
    locationType: "Trực tiếp",
  },
  {
    id: 8,
    courseName: "Cơ số Dữ liệu",
    courseCode: "CO2003",
    instructor: "TS. Phạm Thị Lan",
    date: "Thứ 7\n09/11/2025",
    time: "09:00 - 11:00",
    location: "Microsoft Teams",
    locationType: "Trực tuyến",
  },
  {
    id: 9,
    courseName: "Cấu trúc Dữ liệu",
    courseCode: "CO2013",
    instructor: "TS. Hoàng Văn Độc",
    date: "Chủ nhật\n10/11/2025",
    time: "15:00 - 17:00",
    location: "Google Meet",
    locationType: "Trực tuyến",
  },
]

export default function SchedulePage() {
  const [weekStart] = useState("04/11/2025")
  const [weekEnd] = useState("10/11/2025")
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          

          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Lịch học</h1>
            <p className="text-gray-600">Xem danh sách các buổi học sắp tới và quản lý lịch trình của bạn</p>
          </div>

          {/* Week Selector */}
          <div className="mb-8 flex items-center justify-center gap-4 bg-white border border-gray-200 rounded-lg p-6">
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
             <ChevronLeft  />
            </button>
                    <div className="text-center">
            <p className="text-sm font-medium text-gray-900 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Tuần: {weekStart} - {weekEnd}
            </p>
          </div>

          
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <ChevronRight  />
            </button>
          </div>

          {/* Schedule List Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2 text-gray-900">Lịch học sắp tới</h2>
            <p className="text-sm text-gray-600 mb-6">Danh sách các buổi học trong tuần hiện tại</p>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">TT</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">Tên môn học</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">Mã môn</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">Giảng viên</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">Ngày</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">Giờ học</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">Địa điểm</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">Loại</th>
                    <th className="px-4 py-3 text-left font-semibold text-xs text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((course, idx) => (
                    <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-center text-gray-900">{idx + 1}</td>
                      <td className="px-4 py-4 font-medium text-gray-900">{course.courseName}</td>
                      <td className="px-4 py-4">
                        <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                          {course.courseCode}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{course.instructor}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-pre-line">{course.date}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <span>🕐</span>
                          {course.time}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          {course.location}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                            course.locationType === "Trực tiếp"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {course.locationType}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors">
                          Xác nhận
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Info */}
            <div className="mt-6 flex items-center justify-between text-xs text-gray-600">
              <p>Tổng cộng: 9 buổi học</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>4 buổi trực tuyến</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>5 buổi trực tiếp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
